# ERP_SYSTEM
A full-stack **ERP (Enterprise Resource Planning) System** designed to digitize and automate organizational workflows such as HR management, employee services, and administrative operations.

---

## 📌 Project Overview

The ERP System simplifies internal business processes by providing role-based access for **Admins** and **Employees**, enabling efficient management of leaves, salary slips, enquiries, and quotations through a secure and scalable web application.

---
<img width="1920" height="1080" alt="Screenshot (27)" src="https://github.com/user-attachments/assets/a3d2a91b-0cc0-41c2-964f-0863a657ae20" />
<img width="1920" height="1080" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/42c33ed7-ef3f-4dee-b4a0-4f5e4d564cde" />
<img width="1920" height="1080" alt="Screenshot (29)" src="https://github.com/user-attachments/assets/ad7306e3-b2c5-46be-9a62-4f3d6c9119a1" />
<img width="1920" height="1080" alt="Screenshot (28)" src="https://github.com/user-attachments/assets/c9f21547-a20c-43f2-aea4-8cc3ce138a7a" />
<img width="1920" height="1080" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/0319257c-652b-4eb9-9fb5-2c3086f271ff" />
<img width="1920" height="1080" alt="Screenshot (23)" src="https://github.com/user-attachments/assets/8c7557b4-384e-4ece-88cc-9865d18e6307" />
<img width="1920" height="1080" alt="Screenshot (17)" src="https://github.com/user-attachments/assets/e2f6d77b-ae25-48eb-bc62-50e2462b8e76" />
<img width="1920" height="1080" alt="Screenshot (15)" src="https://github.com/user-attachments/assets/002fb488-50db-4646-b987-76195d5b1252" />
<img width="1920" height="1080" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/5779b4c2-cf48-4924-9e32-c5ed837c2a5f" />

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Secure login for Admins and Employees

### 👨‍💼 Admin Panel
- Manage employees
- Approve/reject leave requests
- Generate and upload salary slips (PDF)
- Handle enquiries and quotations

### 👩‍💻 Employee Panel
- Apply for leave
- View leave status
- Download salary slips
- Submit enquiries

### 📄 File & PDF Handling
- Salary slip generation
- Secure PDF upload and download

---

## 🛠 Tech Stack

### Frontend
- React.js
- HTML, CSS, JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Other Tools & Libraries
- JWT (Authentication)
- Multer (File Upload)
- pdf-lib (PDF handling)
- REST APIs

---


## 📁 Folder Structure (Simplified)

ERP_SYSTEM/
│
├── backend/                      # Backend (Node.js + Express)
│   ├── config/                   # Database & app configuration
│   │   └── db.js
│   │
│   ├── controllers/              # Business logic
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── leaveController.js
│   │   ├── salaryController.js
│   │   └── enquiryController.js
│   │
│   ├── middleware/               # Custom middlewares
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── roleMiddleware.js     # Role-based access
│   │
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Leave.js
│   │   ├── Salary.js
│   │   └── Enquiry.js
│   │
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── salaryRoutes.js
│   │   └── enquiryRoutes.js
│   │
│   ├── uploads/                  # Uploaded files (PDFs)
│   │   └── salary-slips/
│   │
│   ├── utils/                    # Helper functions
│   │   └── pdfGenerator.js
│   │
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                 # Entry point
│
├── frontend/                     # Frontend (React)
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Pages (Admin, Employee)
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── EmployeeDashboard.jsx
│   │   │
│   │   ├── services/             # API calls
│   │   │   └── api.js
│   │   │
│   │   ├── context/              # Auth & global state
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore                    # Root ignore file
├── README.md
└── LICENSE


---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js
- MongoDB
- Git

---

### 🔹 Backend Setup

```bash
cd backend
npm install
npm run dev
🔹 Frontend Setup
bash
Copy code
cd frontend
npm install
npm start
🔑 Environment Variables
Create a .env file in the backend folder:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
▶️ Usage
Start MongoDB

Run backend server

Run frontend application

Login as Admin or Employee

Manage ERP operations through dashboard

📈 Future Enhancements
Attendance management

Payroll automation

Performance tracking

Email notifications

Mobile app support

👨‍💻 Author
Suryanshu Kushwaha
