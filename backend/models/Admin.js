import mongoose from 'mongoose'

const AdminSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true })

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
