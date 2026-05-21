import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

// ── Models ────────────────────────────────────────────────────────────────────
const EmployeeSchema = new mongoose.Schema({ name: String, empId: String, email: { type: String, lowercase: true, trim: true }, password: String, designation: String, joinDate: Date, status: { type: String, default: 'Active' } }, { timestamps: true })
const ApplicationSchema = new mongoose.Schema({ name: String, email: String, phone: String, role: String, resumePath: String, coverLetterPath: String }, { timestamps: true })
const EnquirySchema = new mongoose.Schema({ name: String, email: String, phone_number: String, message: String, status: { type: String, default: 'open' } }, { timestamps: true })
const QuotationSchema = new mongoose.Schema({ name: String, email: String, phone_number: String, message: String, status: { type: String, default: 'new' } }, { timestamps: true })
const LeaveSchema = new mongoose.Schema({ employeeName: String, employeeEmail: String, fromDate: Date, toDate: Date, days: Number, reason: String, type: String, status: { type: String, default: 'pending' }, monthlyQuota: Number, leavesTakenThisMonth: Number }, { timestamps: true })
const SalarySlipSchema = new mongoose.Schema({ employeeName: String, empId: String, email: String, designation: String, month: String, year: String, basic: Number, hra: Number, allowances: Number, pf: Number, tax: Number, otherDeductions: Number, totalEarnings: Number, totalDeductions: Number, netPay: Number, pdfPath: String }, { timestamps: true })
const LoginActivitySchema = new mongoose.Schema({ email: String, success: Boolean, ip: String, userAgent: String, reason: String }, { timestamps: true })

const Employee      = mongoose.model('Employee',      EmployeeSchema)
const Application   = mongoose.model('Application',   ApplicationSchema)
const Enquiry       = mongoose.model('Enquiry',       EnquirySchema)
const Quotation     = mongoose.model('Quotation',     QuotationSchema)
const LeaveRequest  = mongoose.model('LeaveRequest',  LeaveSchema)
const SalarySlip    = mongoose.model('SalarySlip',    SalarySlipSchema)
const LoginActivity = mongoose.model('LoginActivity', LoginActivitySchema)

// ── Data ──────────────────────────────────────────────────────────────────────
const employees = [
  { empId: 'E001', name: 'Arjun Sharma',    email: 'arjun.sharma@abcit.com',    designation: 'Software Engineer',       joinDate: new Date('2022-03-15'), status: 'Active'   },
  { empId: 'E002', name: 'Priya Nair',      email: 'priya.nair@abcit.com',      designation: 'UI/UX Designer',          joinDate: new Date('2021-07-01'), status: 'Active'   },
  { empId: 'E003', name: 'Rahul Verma',     email: 'rahul.verma@abcit.com',     designation: 'Backend Developer',       joinDate: new Date('2020-11-20'), status: 'Active'   },
  { empId: 'E004', name: 'Sneha Iyer',      email: 'sneha.iyer@abcit.com',      designation: 'Project Manager',         joinDate: new Date('2019-05-10'), status: 'Active'   },
  { empId: 'E005', name: 'Vikram Mehta',    email: 'vikram.mehta@abcit.com',    designation: 'DevOps Engineer',         joinDate: new Date('2023-01-05'), status: 'Active'   },
  { empId: 'E006', name: 'Deepa Pillai',    email: 'deepa.pillai@abcit.com',    designation: 'QA Analyst',              joinDate: new Date('2022-08-22'), status: 'Active'   },
  { empId: 'E007', name: 'Karthik Rajan',   email: 'karthik.rajan@abcit.com',   designation: 'Data Analyst',            joinDate: new Date('2021-03-14'), status: 'Inactive' },
  { empId: 'E008', name: 'Meena Krishnan',  email: 'meena.krishnan@abcit.com',  designation: 'HR Executive',            joinDate: new Date('2020-09-01'), status: 'Active'   },
  { empId: 'E009', name: 'Suresh Babu',     email: 'suresh.babu@abcit.com',     designation: 'Frontend Developer',      joinDate: new Date('2023-04-17'), status: 'Active'   },
  { empId: 'E010', name: 'Anitha Reddy',    email: 'anitha.reddy@abcit.com',    designation: 'Business Analyst',        joinDate: new Date('2022-12-01'), status: 'Active'   },
]

const applications = [
  { name: 'Rohan Gupta',      email: 'rohan.gupta@gmail.com',      phone: '9876543210', role: 'Frontend Developer'   },
  { name: 'Lakshmi Devi',     email: 'lakshmi.devi@gmail.com',     phone: '9123456789', role: 'UI/UX Designer'       },
  { name: 'Aakash Patel',     email: 'aakash.patel@gmail.com',     phone: '9988776655', role: 'Backend Developer'    },
  { name: 'Pooja Menon',      email: 'pooja.menon@yahoo.com',      phone: '9765432109', role: 'QA Engineer'          },
  { name: 'Nikhil Joshi',     email: 'nikhil.joshi@outlook.com',   phone: '9654321098', role: 'DevOps Engineer'      },
  { name: 'Swetha Nambiar',   email: 'swetha.n@gmail.com',         phone: '9543210987', role: 'Data Analyst'         },
  { name: 'Ravi Teja',        email: 'ravi.teja@gmail.com',        phone: '9432109876', role: 'Software Engineer'    },
  { name: 'Kavitha Suresh',   email: 'kavitha.s@gmail.com',        phone: '9321098765', role: 'Business Analyst'     },
]

const enquiries = [
  { name: 'Sanjay Kapoor',   email: 'sanjay.kapoor@gmail.com',   phone_number: '9871234567', message: 'We are looking for ERP solutions for our manufacturing unit. Please contact us.',         status: 'open'   },
  { name: 'Rekha Thomas',    email: 'rekha.thomas@company.com',  phone_number: '9762345678', message: 'Interested in your inventory management module. Need a demo.',                            status: 'closed' },
  { name: 'Mohan Das',       email: 'mohan.das@enterprise.in',   phone_number: '9653456789', message: 'Need HR module for 200+ employees. Can you share pricing?',                              status: 'open'   },
  { name: 'Fatima Sheikh',   email: 'fatima.s@biz.com',          phone_number: '9544567890', message: 'Looking for cloud-based ERP for retail chain. Please call back.',                       status: 'open'   },
  { name: 'Ashok Nair',      email: 'ashok.nair@corp.in',        phone_number: '9435678901', message: 'We need payroll and leave management system. Contact ASAP.',                            status: 'closed' },
  { name: 'Sunita Rao',      email: 'sunita.rao@ventures.com',   phone_number: '9326789012', message: 'Enquiring about your quotation and invoicing module integration.',                      status: 'open'   },
]

const quotations = [
  { name: 'Krishna Exports',      email: 'info@krishnaexports.com',   phone_number: '9214567890', message: 'Require a full ERP suite for 50-user license. Need best price.',                status: 'new'      },
  { name: 'Bharat Textiles',      email: 'purchase@bharattex.com',    phone_number: '9105678901', message: 'Looking for inventory + HR modules. Request quotation for 1-year plan.',         status: 'reviewed' },
  { name: 'Sunrise Builders',     email: 'admin@sunrisebuilders.in',  phone_number: '9096789012', message: 'Need project management + payroll. Please send detailed pricing breakdown.',      status: 'new'      },
  { name: 'Metro Retail Pvt Ltd', email: 'erp@metroretail.com',       phone_number: '9187890123', message: 'Require POS + inventory management integration. Urgently need quotation.',       status: 'sent'     },
  { name: 'Alpha Tech Solutions', email: 'cto@alphatech.io',          phone_number: '9278901234', message: 'Enterprise ERP evaluation for 200 users across 3 locations.',                    status: 'new'      },
  { name: 'Nandini Dairy Co.',    email: 'ops@nandinidairy.com',      phone_number: '9369012345', message: 'Small business ERP with billing and supplier management. What is the cost?',     status: 'reviewed' },
]

const leaveRequests = [
  { employeeName: 'Arjun Sharma',   employeeEmail: 'arjun.sharma@abcit.com',   fromDate: new Date('2026-04-10'), toDate: new Date('2026-04-12'), days: 3, reason: 'Family function',       type: 'Casual',  status: 'approved', monthlyQuota: 2, leavesTakenThisMonth: 2 },
  { employeeName: 'Priya Nair',     employeeEmail: 'priya.nair@abcit.com',     fromDate: new Date('2026-05-01'), toDate: new Date('2026-05-03'), days: 3, reason: 'Medical treatment',     type: 'Sick',    status: 'approved', monthlyQuota: 2, leavesTakenThisMonth: 3 },
  { employeeName: 'Rahul Verma',    employeeEmail: 'rahul.verma@abcit.com',    fromDate: new Date('2026-05-20'), toDate: new Date('2026-05-21'), days: 2, reason: 'Personal work',         type: 'Casual',  status: 'pending',  monthlyQuota: 2, leavesTakenThisMonth: 2 },
  { employeeName: 'Sneha Iyer',     employeeEmail: 'sneha.iyer@abcit.com',     fromDate: new Date('2026-03-15'), toDate: new Date('2026-03-17'), days: 3, reason: 'Vacation',              type: 'Annual',  status: 'approved', monthlyQuota: 2, leavesTakenThisMonth: 0 },
  { employeeName: 'Vikram Mehta',   employeeEmail: 'vikram.mehta@abcit.com',   fromDate: new Date('2026-05-18'), toDate: new Date('2026-05-19'), days: 2, reason: 'Doctor appointment',    type: 'Sick',    status: 'pending',  monthlyQuota: 2, leavesTakenThisMonth: 2 },
  { employeeName: 'Deepa Pillai',   employeeEmail: 'deepa.pillai@abcit.com',   fromDate: new Date('2026-04-22'), toDate: new Date('2026-04-24'), days: 3, reason: 'Travel',                type: 'Annual',  status: 'denied',   monthlyQuota: 2, leavesTakenThisMonth: 1 },
  { employeeName: 'Meena Krishnan', employeeEmail: 'meena.krishnan@abcit.com', fromDate: new Date('2026-05-10'), toDate: new Date('2026-05-10'), days: 1, reason: 'Festival',              type: 'Casual',  status: 'approved', monthlyQuota: 2, leavesTakenThisMonth: 1 },
  { employeeName: 'Suresh Babu',    employeeEmail: 'suresh.babu@abcit.com',    fromDate: new Date('2026-05-22'), toDate: new Date('2026-05-23'), days: 2, reason: 'Personal emergency',    type: 'Casual',  status: 'pending',  monthlyQuota: 2, leavesTakenThisMonth: 0 },
]

const salarySlips = [
  { employeeName: 'Arjun Sharma',   empId: 'E001', email: 'arjun.sharma@abcit.com',   designation: 'Software Engineer',  month: 'April', year: '2026', basic: 45000, hra: 18000, allowances: 5000, pf: 5400, tax: 4500, otherDeductions: 500,  totalEarnings: 68000, totalDeductions: 10400, netPay: 57600 },
  { employeeName: 'Priya Nair',     empId: 'E002', email: 'priya.nair@abcit.com',     designation: 'UI/UX Designer',     month: 'April', year: '2026', basic: 40000, hra: 16000, allowances: 4000, pf: 4800, tax: 3800, otherDeductions: 400,  totalEarnings: 60000, totalDeductions:  9000, netPay: 51000 },
  { employeeName: 'Rahul Verma',    empId: 'E003', email: 'rahul.verma@abcit.com',    designation: 'Backend Developer',  month: 'April', year: '2026', basic: 50000, hra: 20000, allowances: 6000, pf: 6000, tax: 5200, otherDeductions: 600,  totalEarnings: 76000, totalDeductions: 11800, netPay: 64200 },
  { employeeName: 'Sneha Iyer',     empId: 'E004', email: 'sneha.iyer@abcit.com',     designation: 'Project Manager',    month: 'April', year: '2026', basic: 60000, hra: 24000, allowances: 8000, pf: 7200, tax: 6500, otherDeductions: 800,  totalEarnings: 92000, totalDeductions: 14500, netPay: 77500 },
  { employeeName: 'Vikram Mehta',   empId: 'E005', email: 'vikram.mehta@abcit.com',   designation: 'DevOps Engineer',    month: 'April', year: '2026', basic: 48000, hra: 19200, allowances: 5500, pf: 5760, tax: 4900, otherDeductions: 550,  totalEarnings: 72700, totalDeductions: 11210, netPay: 61490 },
  { employeeName: 'Arjun Sharma',   empId: 'E001', email: 'arjun.sharma@abcit.com',   designation: 'Software Engineer',  month: 'March', year: '2026', basic: 45000, hra: 18000, allowances: 5000, pf: 5400, tax: 4500, otherDeductions: 500,  totalEarnings: 68000, totalDeductions: 10400, netPay: 57600 },
  { employeeName: 'Priya Nair',     empId: 'E002', email: 'priya.nair@abcit.com',     designation: 'UI/UX Designer',     month: 'March', year: '2026', basic: 40000, hra: 16000, allowances: 4000, pf: 4800, tax: 3800, otherDeductions: 400,  totalEarnings: 60000, totalDeductions:  9000, netPay: 51000 },
  { employeeName: 'Deepa Pillai',   empId: 'E006', email: 'deepa.pillai@abcit.com',   designation: 'QA Analyst',         month: 'April', year: '2026', basic: 38000, hra: 15200, allowances: 3800, pf: 4560, tax: 3600, otherDeductions: 380,  totalEarnings: 57000, totalDeductions:  8540, netPay: 48460 },
  { employeeName: 'Meena Krishnan', empId: 'E008', email: 'meena.krishnan@abcit.com', designation: 'HR Executive',       month: 'April', year: '2026', basic: 35000, hra: 14000, allowances: 3500, pf: 4200, tax: 3200, otherDeductions: 350,  totalEarnings: 52500, totalDeductions:  7750, netPay: 44750 },
  { employeeName: 'Suresh Babu',    empId: 'E009', email: 'suresh.babu@abcit.com',    designation: 'Frontend Developer', month: 'April', year: '2026', basic: 42000, hra: 16800, allowances: 4200, pf: 5040, tax: 4100, otherDeductions: 420,  totalEarnings: 63000, totalDeductions:  9560, netPay: 53440 },
]

const loginActivities = [
  { email: 'arjun.sharma@abcit.com',   success: true,  ip: '192.168.1.10', userAgent: 'Mozilla/5.0 Chrome/124', reason: null },
  { email: 'priya.nair@abcit.com',     success: true,  ip: '192.168.1.11', userAgent: 'Mozilla/5.0 Chrome/124', reason: null },
  { email: 'rahul.verma@abcit.com',    success: false, ip: '192.168.1.12', userAgent: 'Mozilla/5.0 Firefox/125', reason: 'bad-pwd' },
  { email: 'rahul.verma@abcit.com',    success: true,  ip: '192.168.1.12', userAgent: 'Mozilla/5.0 Firefox/125', reason: null },
  { email: 'sneha.iyer@abcit.com',     success: true,  ip: '192.168.1.13', userAgent: 'Mozilla/5.0 Safari/17',  reason: null },
  { email: 'hacker@unknown.com',       success: false, ip: '45.33.32.156',  userAgent: 'curl/7.88',              reason: 'no-user' },
  { email: 'vikram.mehta@abcit.com',   success: true,  ip: '192.168.1.15', userAgent: 'Mozilla/5.0 Edge/124',   reason: null },
  { email: 'deepa.pillai@abcit.com',   success: false, ip: '192.168.1.16', userAgent: 'Mozilla/5.0 Chrome/124', reason: 'bad-pwd' },
  { email: 'meena.krishnan@abcit.com', success: true,  ip: '192.168.1.18', userAgent: 'Mozilla/5.0 Chrome/124', reason: null },
  { email: 'suresh.babu@abcit.com',    success: true,  ip: '192.168.1.19', userAgent: 'Mozilla/5.0 Chrome/124', reason: null },
  { email: 'admin@gmail.com',          success: true,  ip: '192.168.1.1',  userAgent: 'Mozilla/5.0 Chrome/124', reason: null },
  { email: 'test@fake.com',            success: false, ip: '103.21.244.0',  userAgent: 'python-requests/2.31',  reason: 'no-user' },
]

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected to MongoDB Atlas\n')

  // Hash a common password for all employees (emp@123)
  const hashedPwd = await bcrypt.hash('emp@123', 10)

  // Clear existing data (except admins)
  await Promise.all([
    Employee.deleteMany({}),
    Application.deleteMany({}),
    Enquiry.deleteMany({}),
    Quotation.deleteMany({}),
    LeaveRequest.deleteMany({}),
    SalarySlip.deleteMany({}),
    LoginActivity.deleteMany({}),
  ])
  console.log('🗑️  Cleared old data (admins untouched)\n')

  // Insert
  const empDocs = await Employee.insertMany(employees.map(e => ({ ...e, password: hashedPwd })))
  console.log(`👥 Employees      : ${empDocs.length} inserted`)

  const appDocs = await Application.insertMany(applications)
  console.log(`📄 Applications   : ${appDocs.length} inserted`)

  const enqDocs = await Enquiry.insertMany(enquiries)
  console.log(`💬 Enquiries      : ${enqDocs.length} inserted`)

  const quotDocs = await Quotation.insertMany(quotations)
  console.log(`💰 Quotations     : ${quotDocs.length} inserted`)

  const leaveDocs = await LeaveRequest.insertMany(leaveRequests)
  console.log(`🏖️  Leave Requests : ${leaveDocs.length} inserted`)

  const salDocs = await SalarySlip.insertMany(salarySlips)
  console.log(`💵 Salary Slips   : ${salDocs.length} inserted`)

  const logDocs = await LoginActivity.insertMany(loginActivities)
  console.log(`🔐 Login Activity : ${logDocs.length} inserted`)

  console.log('\n🎉 All dummy data seeded successfully!')
  console.log('\n📧 Employee login password for all: emp@123')
  await mongoose.disconnect()
}

seed().catch(err => { console.error('❌ Seed error:', err); process.exit(1) })
