import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import Employee from './models/Employee.js'
import Application from './models/Application.js'
import Enquiry from './models/Enquiry.js'
import Quotation from './models/Quotation.js'
import LeaveRequest from './models/LeaveRequest.js'
import SalarySlip from './models/SalarySlip.js'
import LoginActivity from './models/LoginActivity.js'
import Admin from './models/Admin.js'

import multer from 'multer'
import fs from 'fs'
import PDFDocument from 'pdfkit'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Serve uploads folder if present
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'
const DEFAULT_ADMIN_PWD = process.env.DEFAULT_ADMIN_PWD || 'admin123'
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'erp@AdminKey2024'

let dbConnected = false
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      dbConnected = true
      console.log('MongoDB connected')
    })
    .catch((err) => console.error('MongoDB connection error:', err))
} else {
  console.log('MONGO_URI not set — running with in-memory sample data')
}

// Sample employees fallback when no DB available
const sampleEmployees = [
  { _id: '1', empId: 'E001', name: 'Alice Kumar', email: 'alice@example.com', designation: 'Developer', joinDate: new Date('2022-03-01'), status: 'Active' },
  { _id: '2', empId: 'E002', name: 'Bob Singh', email: 'bob@example.com', designation: 'Designer', joinDate: new Date('2021-10-15'), status: 'Active' },
]
// In-memory demo salary slips when DB not configured
const sampleSalarySlips = []


// ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')
try { fs.mkdirSync(uploadsDir, { recursive: true }) } catch (e) {}

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '_' + Math.random().toString(36).slice(2, 10)
    cb(null, unique + '_' + (file.originalname || 'file'))
  }
})
const upload = multer({ storage })

// ─── Professional Salary Slip PDF Builder ─────────────────────────────────────
function buildSalaryPDF(doc, slip) {
  const W = 595.28  // A4 width in points
  const accent = '#1e40af'   // deep blue
  const accentLight = '#dbeafe'
  const textDark = '#1e293b'
  const textMuted = '#64748b'
  const green = '#166534'
  const greenBg = '#dcfce7'
  const red = '#991b1b'
  const redBg = '#fee2e2'

  // ── Header banner ────────────────────────────────────────────────────────
  doc.rect(0, 0, W, 90).fill(accent)

  doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold')
    .text('ABC IT Solutions', 40, 20, { width: 350 })
  doc.fontSize(10).font('Helvetica')
    .text('Enterprise Resource Planning System', 40, 48)
  doc.fontSize(10)
    .text('www.abcitsolutions.com  |  support@abcit.com', 40, 62)

  // Slip label badge (top-right)
  doc.rect(W - 160, 20, 130, 50).fill('rgba(255,255,255,0.15)').stroke()
  doc.fillColor('#ffffff').fontSize(13).font('Helvetica-Bold')
    .text('SALARY SLIP', W - 155, 30, { width: 120, align: 'center' })
  doc.fontSize(9).font('Helvetica')
    .text(`${(slip.month || '').toUpperCase()} ${slip.year || ''}`, W - 155, 50, { width: 120, align: 'center' })

  // ── Employee info card ────────────────────────────────────────────────────
  let y = 105
  doc.rect(30, y, W - 60, 80).fill('#f8fafc').stroke('#e2e8f0')

  const col1 = 45, col2 = 320
  const labelY = y + 12
  doc.fillColor(textMuted).fontSize(8).font('Helvetica')
  doc.text('EMPLOYEE NAME', col1, labelY)
  doc.text('EMPLOYEE ID', col2, labelY)

  doc.fillColor(textDark).fontSize(11).font('Helvetica-Bold')
  doc.text(slip.employeeName || slip.name || '—', col1, labelY + 12)
  doc.text(slip.empId || '—', col2, labelY + 12)

  doc.fillColor(textMuted).fontSize(8).font('Helvetica')
  doc.text('DESIGNATION', col1, labelY + 32)
  doc.text('PAY PERIOD', col2, labelY + 32)

  doc.fillColor(textDark).fontSize(10).font('Helvetica-Bold')
  doc.text(slip.designation || '—', col1, labelY + 44)
  doc.text(`${slip.month || ''} ${slip.year || ''}`, col2, labelY + 44)

  // ── Earnings table ────────────────────────────────────────────────────────
  y = 205
  doc.fillColor(accent).fontSize(11).font('Helvetica-Bold')
    .text('EARNINGS', 30, y)

  const tableTop = y + 18
  const colLabel = 40, colAmt = W - 150

  // Table header
  doc.rect(30, tableTop, W - 60, 22).fill(accentLight)
  doc.fillColor(accent).fontSize(9).font('Helvetica-Bold')
  doc.text('COMPONENT', colLabel, tableTop + 7)
  doc.text('AMOUNT (INR)', colAmt, tableTop + 7, { width: 100, align: 'right' })

  const earningsRows = [
    ['Basic Salary', slip.basic || 0],
    ['House Rent Allowance (HRA)', slip.hra || 0],
    ['Other Allowances', slip.allowances || 0],
  ]

  let rowY = tableTop + 22
  earningsRows.forEach(([label, amt], i) => {
    if (i % 2 === 0) doc.rect(30, rowY, W - 60, 20).fill('#f8fafc')
    doc.fillColor(textDark).fontSize(10).font('Helvetica')
    doc.text(label, colLabel, rowY + 5)
    doc.text(`Rs. ${Number(amt).toLocaleString('en-IN')}`, colAmt, rowY + 5, { width: 100, align: 'right' })
    rowY += 20
  })

  // Earnings total
  const totalEarnings = Number(slip.totalEarnings) || (Number(slip.basic || 0) + Number(slip.hra || 0) + Number(slip.allowances || 0))
  doc.rect(30, rowY, W - 60, 22).fill(accentLight)
  doc.fillColor(accent).fontSize(10).font('Helvetica-Bold')
  doc.text('Total Earnings', colLabel, rowY + 6)
  doc.text(`Rs. ${totalEarnings.toLocaleString('en-IN')}`, colAmt, rowY + 6, { width: 100, align: 'right' })
  rowY += 22

  // ── Deductions table ──────────────────────────────────────────────────────
  y = rowY + 18
  doc.fillColor(red).fontSize(11).font('Helvetica-Bold')
    .text('DEDUCTIONS', 30, y)

  const dedTop = y + 18
  doc.rect(30, dedTop, W - 60, 22).fill('#fee2e2')
  doc.fillColor(red).fontSize(9).font('Helvetica-Bold')
  doc.text('COMPONENT', colLabel, dedTop + 7)
  doc.text('AMOUNT (INR)', colAmt, dedTop + 7, { width: 100, align: 'right' })

  const dedRows = [
    ['Provident Fund (PF)', slip.pf || 0],
    ['Income Tax (TDS)', slip.tax || 0],
    ['Other Deductions', slip.otherDeductions || slip.deductions || 0],
  ]

  rowY = dedTop + 22
  dedRows.forEach(([label, amt], i) => {
    if (i % 2 === 0) doc.rect(30, rowY, W - 60, 20).fill('#fef2f2')
    doc.fillColor(textDark).fontSize(10).font('Helvetica')
    doc.text(label, colLabel, rowY + 5)
    doc.text(`Rs. ${Number(amt).toLocaleString('en-IN')}`, colAmt, rowY + 5, { width: 100, align: 'right' })
    rowY += 20
  })

  const totalDeductions = Number(slip.totalDeductions) || (Number(slip.pf || 0) + Number(slip.tax || 0) + Number(slip.otherDeductions || slip.deductions || 0))
  doc.rect(30, rowY, W - 60, 22).fill('#fee2e2')
  doc.fillColor(red).fontSize(10).font('Helvetica-Bold')
  doc.text('Total Deductions', colLabel, rowY + 6)
  doc.text(`Rs. ${totalDeductions.toLocaleString('en-IN')}`, colAmt, rowY + 6, { width: 100, align: 'right' })
  rowY += 22

  // ── Net Pay box ───────────────────────────────────────────────────────────
  rowY += 16
  doc.rect(30, rowY, W - 60, 48).fill(green)
  doc.fillColor('#ffffff').fontSize(11).font('Helvetica')
    .text('NET PAY (Take Home)', colLabel, rowY + 10)

  const netPay = Number(slip.netPay) || (totalEarnings - totalDeductions)
  doc.fontSize(20).font('Helvetica-Bold')
    .text(`Rs. ${netPay.toLocaleString('en-IN')}`, colAmt - 50, rowY + 8, { width: 150, align: 'right' })

  // ── Footer ────────────────────────────────────────────────────────────────
  rowY += 80
  doc.rect(0, 780, W, 60).fill(accent)
  doc.fillColor('rgba(255,255,255,0.7)').fontSize(8).font('Helvetica')
    .text('This is a system-generated salary slip and does not require a physical signature.', 30, 790, { width: W - 60, align: 'center' })
  doc.fillColor('#ffffff').fontSize(8)
    .text('ABC IT Solutions  |  ERP System  |  Confidential', 30, 805, { width: W - 60, align: 'center' })
}



// Auth: simple admin + employee login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' })

    // admin default
    if (email === 'admin@abcit.com' && password === DEFAULT_ADMIN_PWD) {
      const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
      return res.json({ token })
    }

    if (!dbConnected) {
      // record failed login attempt
      try { await LoginActivity.create({ email, success: false, reason: 'no-db' }) } catch(e){}
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const emp = await Employee.findOne({ email })
    if (!emp) {
      try { await LoginActivity.create({ email, success: false, reason: 'no-user' }) } catch(e){}
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const match = await bcrypt.compare(password || '', emp.password || '')
    if (!match) {
      try { await LoginActivity.create({ email, success: false, reason: 'bad-pwd' }) } catch(e){}
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ email: emp.email, role: 'employee', id: emp._id }, JWT_SECRET, { expiresIn: '7d' })
    try { await LoginActivity.create({ email, success: true }) } catch(e){}
    return res.json({ token })
  } catch (err) {
    console.error('Login error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// ─── Admin Register ───────────────────────────────────────────────────────────
app.post('/api/admin/register', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body || {}
    if (!name || !email || !password || !secretKey)
      return res.status(400).json({ error: 'All fields are required' })

    if (secretKey !== ADMIN_SECRET_KEY)
      return res.status(403).json({ error: 'Invalid secret key' })

    if (!dbConnected)
      return res.status(503).json({ error: 'Database not connected' })

    const existing = await Admin.findOne({ email: email.toLowerCase() })
    if (existing)
      return res.status(409).json({ error: 'An admin with this email already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const admin = new Admin({ name, email, password: hashed })
    await admin.save()

    const token = jwt.sign({ email: admin.email, role: 'admin', id: admin._id }, JWT_SECRET, { expiresIn: '7d' })
    return res.status(201).json({ message: 'Admin registered successfully', token, name: admin.name, email: admin.email })
  } catch (err) {
    console.error('POST /api/admin/register error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// ─── Admin Login ──────────────────────────────────────────────────────────────
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' })

    // Fallback: legacy hardcoded admin
    if (email === 'admin@gmail.com' && password === DEFAULT_ADMIN_PWD) {
      const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
      return res.json({ token, name: 'Admin', email })
    }

    if (!dbConnected)
      return res.status(503).json({ error: 'Database not connected' })

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin)
      return res.status(401).json({ error: 'Invalid email or password' })

    const match = await bcrypt.compare(password, admin.password)
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password' })

    const token = jwt.sign({ email: admin.email, role: 'admin', id: admin._id }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, name: admin.name, email: admin.email })
  } catch (err) {
    console.error('POST /api/admin/login error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Login activities list
app.get('/api/login-activities', async (req, res) => {
  try {
    const limit = Math.min(1000, Number(req.query.limit) || 500)
    if (!dbConnected) return res.json([])
    const items = await LoginActivity.find({}).sort({ createdAt: -1 }).limit(limit).lean()
    return res.json(items)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

// Employees
app.get('/api/employees', async (req, res) => {
  try {
    const { search } = req.query || {}
    if (!dbConnected) {
      if (!search) return res.json(sampleEmployees)
      const q = search.toLowerCase()
      return res.json(sampleEmployees.filter(e => (e.name || '').toLowerCase().includes(q) || (e.email || '').toLowerCase().includes(q) || (e.empId || '').toLowerCase().includes(q)))
    }

    const q = search
      ? { $or: [ { name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { empId: { $regex: search, $options: 'i' } } ] }
      : {}

    const list = await Employee.find(q).sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (err) {
    console.error('GET /api/employees error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Applications: file upload + metadata
app.post('/api/applications', upload.fields([{ name: 'resume' }, { name: 'coverLetterFile' }]), async (req, res) => {
  try {
    const body = req.body || {}
    const files = req.files || {}
    const resume = files.resume && files.resume[0] ? path.join('uploads', path.basename(files.resume[0].path)) : null
    const cover = files.coverLetterFile && files.coverLetterFile[0] ? path.join('uploads', path.basename(files.coverLetterFile[0].path)) : null
    if (!dbConnected) {
      const app = { _id: Date.now().toString(), name: body.name, email: body.email, phone: body.phone, position: body.role || body.position, resumePath: resume, coverLetterPath: cover, createdAt: new Date() }
      return res.status(201).json(app)
    }
    const doc = new Application({ name: body.name, email: body.email, phone: body.phone, role: body.role || body.position, resumePath: resume, coverLetterPath: cover })
    await doc.save()
    return res.status(201).json(doc)
  } catch (err) { console.error('POST /api/applications', err); return res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/applications', async (req, res) => {
  try {
    if (!dbConnected) return res.json([])
    const list = await Application.find({}).sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!dbConnected) return res.status(200).json({})
    const doc = await Application.findByIdAndDelete(id)
    if (doc) {
      if (doc.resumePath) try { fs.unlinkSync(path.join(__dirname, doc.resumePath)); } catch(e){}
      if (doc.coverLetterPath) try { fs.unlinkSync(path.join(__dirname, doc.coverLetterPath)); } catch(e){}
    }
    return res.json({})
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

// Quotations
app.post('/api/quotations', async (req, res) => {
  try {
    const body = req.body || {}
    if (!dbConnected) return res.status(201).json({ _id: Date.now().toString(), ...body, createdAt: new Date() })
    const doc = new Quotation({ name: body.name, email: body.email, phone_number: body.phone_number, message: body.message })
    await doc.save()
    return res.status(201).json({ message: 'Quotation received' })
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

// Salary slips
app.post('/api/salary-slips', upload.none(), async (req, res) => {
  try {
    const body = req.body || {}
    if (!dbConnected) {
      const obj = { _id: Date.now().toString(), ...body, createdAt: new Date() }
      // generate PDF for demo slips so client can download immediately
      try {
        const id = obj._id
        const filename = `salary_${id}.pdf`
        const filepath = path.join(uploadsDir, filename)
        const doc = new PDFDocument({ size: 'A4', margin: 0 })
        const stream = fs.createWriteStream(filepath)
        doc.pipe(stream)
        buildSalaryPDF(doc, obj)
        doc.end()
        // Wait for stream to finish synchronously before responding
        await new Promise((resolve, reject) => {
          stream.on('finish', resolve)
          stream.on('error', reject)
        })
        obj.pdfPath = path.join('uploads', filename)
      } catch (e) {
        console.error('Demo PDF generation error', e)
      }
      sampleSalarySlips.unshift(obj)
      return res.status(201).json(obj)
    }
    // DB mode: save to MongoDB
    const doc = new SalarySlip({
      employeeName: body.employeeName,
      empId: body.empId,
      email: body.email,
      designation: body.designation,
      month: body.month,
      year: body.year,
      basic: Number(body.basic) || 0,
      hra: Number(body.hra) || 0,
      allowances: Number(body.allowances) || 0,
      pf: Number(body.pf) || 0,
      tax: Number(body.tax) || 0,
      otherDeductions: Number(body.otherDeductions) || 0,
      totalEarnings: Number(body.totalEarnings) || 0,
      totalDeductions: Number(body.totalDeductions) || 0,
      netPay: Number(body.netPay) || 0,
    })
    await doc.save()
    return res.status(201).json(doc)
  } catch (err) { console.error('POST /api/salary-slips', err); return res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/salary-slips', async (req, res) => {
  try {
    const { email } = req.query || {}
    if (!dbConnected) {
      // return in-memory demo slips, optionally filtered by email
      if (!email) return res.json(sampleSalarySlips)
      const filtered = sampleSalarySlips.filter(s => (s.email || '').toLowerCase() === (email || '').toLowerCase())
      return res.json(filtered)
    }
    const q = email ? { email } : {}
    const list = await SalarySlip.find(q).sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

// generate PDF for a slip
app.post('/api/salary-slips/:id/generate', async (req, res) => {
  try {
    const { id } = req.params
    if (!dbConnected) {
      // For demo mode: try to find an in-memory slip and generate a PDF from it
      const slip = sampleSalarySlips.find(s => String(s._id) === String(id))
      if (!slip) return res.status(404).json({ error: 'Not available in demo' })
      const filename = `salary_${id}.pdf`
      const filepath = path.join(uploadsDir, filename)
      const doc = new PDFDocument({ size: 'A4', margin: 0 })
      const stream = fs.createWriteStream(filepath)
      doc.pipe(stream)
      buildSalaryPDF(doc, slip)
      doc.end()
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve)
        stream.on('error', reject)
      })
      slip.pdfPath = 'uploads/' + filename
      return res.json({ pdfPath: slip.pdfPath })
    }
    const slip = await SalarySlip.findById(id)
    if (!slip) return res.status(404).json({ error: 'Not found' })
    const filename = `salary_${id}.pdf`
    const filepath = path.join(uploadsDir, filename)
    const doc = new PDFDocument({ size: 'A4', margin: 0 })
    const stream = fs.createWriteStream(filepath)
    doc.pipe(stream)
    buildSalaryPDF(doc, slip)
    doc.end()
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve)
      stream.on('error', reject)
    })
    slip.pdfPath = 'uploads/' + filename
    await slip.save()
    return res.json({ pdfPath: slip.pdfPath })
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/salary-slips/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params
    if (!dbConnected) return res.status(404).send('Not available')
    const slip = await SalarySlip.findById(id)
    if (!slip) return res.status(404).send('Not found')

    // Always regenerate on the fly to get latest design
    const filename = `salary_${id}.pdf`
    const filepath = path.join(uploadsDir, filename)
    const doc = new PDFDocument({ size: 'A4', margin: 0 })
    const stream = fs.createWriteStream(filepath)
    doc.pipe(stream)
    buildSalaryPDF(doc, slip)
    doc.end()
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve)
      stream.on('error', reject)
    })
    
    // Save path if it was missing before
    if (!slip.pdfPath) {
      slip.pdfPath = 'uploads/' + filename
      await slip.save()
    }

    const full = path.join(__dirname, slip.pdfPath.replace(/\\/g, '/'))
    return res.sendFile(full)
  } catch (err) { console.error(err); return res.status(500).send('Server error') }
})

app.get('/api/quotations', async (req, res) => {
  try {
    if (!dbConnected) return res.json([])
    const list = await Quotation.find({}).sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

// Leaves
app.post('/api/leaves', async (req, res) => {
  try {
    const body = req.body || {}
    if (!dbConnected) return res.status(201).json({ _id: Date.now().toString(), ...body, createdAt: new Date() })
    const doc = new LeaveRequest(body)
    await doc.save()
    return res.status(201).json(doc)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/leaves', async (req, res) => {
  try {
    const { email, status, search } = req.query || {}
    if (!dbConnected) return res.json([])
    const q = {}
    if (email) q.employeeEmail = email
    if (status && status !== 'all') q.status = status
    if (search) q.$or = [ { employeeName: { $regex: search, $options: 'i' } }, { employeeEmail: { $regex: search, $options: 'i' } } ]
    const list = await LeaveRequest.find(q).sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

// Auto-approve pending leaves (used by admin assistant)
app.post('/api/leaves/auto-approve', async (req, res) => {
  try {
    const { email } = req.body || {}
    if (!dbConnected) {
      // Demo mode: backend not connected to DB — return a helpful response
      return res.status(200).json({ message: 'Not available in demo', matched: 0, modified: 0 })
    }

    const q = { status: 'pending' }
    if (email) q.employeeEmail = email

    const matched = await LeaveRequest.countDocuments(q)
    if (!matched) return res.json({ message: 'No pending leaves matched', matched: 0, modified: 0 })

    const r = await LeaveRequest.updateMany(q, { $set: { status: 'approved' } })
    const modified = (r && (r.modifiedCount || r.nModified || r.modified)) || 0
    return res.json({ message: 'Auto-approve completed', matched, modified })
  } catch (err) {
    console.error('POST /api/leaves/auto-approve', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/leaves/:id/:action', async (req, res) => {
  try {
    const { id, action } = req.params
    if (!dbConnected) return res.status(200).json({})
    const doc = await LeaveRequest.findById(id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    if (action === 'approve') doc.status = 'approved'
    else if (action === 'deny') doc.status = 'denied'
    await doc.save()
    return res.json(doc)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/leaves/bulk-action', async (req, res) => {
  try {
    const { ids, action } = req.body || {}
    if (!dbConnected) return res.status(200).json({})
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Invalid ids' })
    const status = action === 'approve' ? 'approved' : 'denied'
    await LeaveRequest.updateMany({ _id: { $in: ids } }, { $set: { status } })
    return res.json({})
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

app.put('/api/quotations/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body || {}
    if (!dbConnected) return res.status(200).json({})
    const doc = await Quotation.findById(id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    Object.assign(doc, updates)
    await doc.save()
    return res.json(doc)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

app.delete('/api/quotations/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!dbConnected) return res.status(200).json({})
    await Quotation.findByIdAndDelete(id)
    return res.json({})
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/employees', async (req, res) => {
  try {
    const body = req.body || {}
    if (!dbConnected) {
      const newEmp = { _id: Date.now().toString(), ...body }
      sampleEmployees.unshift(newEmp)
      return res.status(201).json(newEmp)
    }

    if (body.password) body.password = await bcrypt.hash(body.password, 10)
    const emp = new Employee(body)
    await emp.save()
    return res.status(201).json(emp)
  } catch (err) {
    console.error('POST /api/employees error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Enquiries
app.post('/api/enquiries', async (req, res) => {
  try {
    const body = req.body || {}
    if (!dbConnected) return res.status(201).json({ ...body, _id: Date.now().toString(), createdAt: new Date() })
    const doc = new Enquiry({ name: body.name, email: body.email, phone_number: body.phone_number, message: body.message })
    await doc.save()
    return res.status(201).json(doc)
  } catch (err) { console.error('POST /api/enquiries', err); return res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/enquiries', async (req, res) => {
  try {
    if (!dbConnected) return res.json([])
    const q = req.query.search ? { $or: [ { name: { $regex: req.query.search, $options: 'i' } }, { email: { $regex: req.query.search, $options: 'i' } } ] } : {}
    const list = await Enquiry.find(q).sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

app.put('/api/enquiries/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body || {}
    if (!dbConnected) return res.status(200).json({})
    const doc = await Enquiry.findById(id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    Object.assign(doc, updates)
    await doc.save()
    return res.json(doc)
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Server error' }) }
})

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body || {}
    if (!dbConnected) {
      const idx = sampleEmployees.findIndex(e => String(e._id) === String(id))
      if (idx === -1) return res.status(404).json({ error: 'Not found' })
      if (updates.password) sampleEmployees[idx].password = updates.password
      if (updates.status) sampleEmployees[idx].status = updates.status
      return res.json({ employee: sampleEmployees[idx] })
    }

    const emp = await Employee.findById(id)
    if (!emp) return res.status(404).json({ error: 'Not found' })
    if (updates.password) emp.password = await bcrypt.hash(updates.password, 10)
    if (updates.status) emp.status = updates.status
    await emp.save()
    return res.json({ employee: emp })
  } catch (err) {
    console.error('PUT /api/employees/:id error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Serve frontend static files in production
const frontendDist = path.join(__dirname, '../frontend/dist')
app.use(express.static(frontendDist))
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
