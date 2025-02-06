

## NEXBANK 
# Transaction Management System

## Overview

A comprehensive full-stack web application for managing user transactions, deposits, transfers, withdrawals and commissions with advanced features and modern web technologies.

## 🚀 Features

- **User Authentication**: 
  - Secure registration and login
  - JWT-based authentication with refresh tokens
  - Password reset functionality

- **Transaction Management**:
  - Create and manage fund transfers
  - Admin approval for deposits and transfers
  - Transaction tracking and status updates

- **Commission Tracking**:
  - Automatic commission recording
  - Detailed commission reports
  - Admin commission dashboard

- **Notification System**:
  - Automated email notifications
  - Transaction approval alerts
  - Password reset emails

## 💻 Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- TypeScript
- Nodemailer

### Frontend
- React
- Redux Toolkit & RTK Query
- Material UI
- Framer Motion
- React Router DOM
- React Hook Form
- i18next (Internationalization)

## 🛠 Installation

### Prerequisites
- Node.js (v14+)
- npm or Yarn
- MongoDB

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/abhayrana1701/transaction-management-system.git
cd project-root/backend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# PORT, MONGO_URI, EMAIL_USER, EMAIL_PASS, JWT_SECRET, etc.

# Run the server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# REACT_APP_API_URL

# Start the frontend
npm start
```

## 📦 Key Endpoints

### Authentication and User
- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/forgot-password`
- `POST /api/users/reset-password`
- `POST /api/users/profile`
- `POST /api/users/logout`
- `POST /api/users/refresh-token`

### Transactions
- `POST /api/admin/request-transfer`
- `POST /api/admin/approve-transfer`
- `GET /api/admin/pending-transactions`
- `POST /api/admin/approve-deposit`

### Commissions
- `GET /api/admin/commissions/`

### Transactions
- `POST /api/transactions/request-add-funds`
- `POST /api/transactions/process-withdrawals`

## 🧪 Testing
```bash
# Run tests
npm test
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## 📄 License
MIT License

## 📞 Contact
For support or questions, contact Abhay Rana

