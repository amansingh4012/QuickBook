# QuickBook - Cinema Booking System 🎬

> Full-Stack Cinema Booking Application

## 📖 About This Project

QuickBook is a comprehensive cinema ticket booking application built with React, Node.js, and MySQL. This full-stack platform enables users to browse movies, select seats in real-time, and make bookings seamlessly, while providing cinema administrators with powerful tools to manage their operations efficiently.

This project demonstrates modern web development practices, real-time communication, and scalable architecture design.

## 🎥 Demo

**Live Application**: [View Demo](https://scaler-assignment-five.vercel.app/) *(if deployed)*

**Demo Credentials**:
- **Admin**: admin@gmail.com / 123456
- **User**: test@gmail.com / 123456

**API Documentation**: Available at `/api-docs` endpoint when running locally

## ✨ Key Features

A complete cinema booking system with:

- **For Moviegoers:**
  - Browse available movies
  - View cinema locations and showtimes
  - Select seats with a visual seat map
  - Book tickets securely
  - View booking history

- **For Cinema Administrators:**
  - Manage movies, cinemas, and screens
  - Schedule shows across different locations
  - Monitor bookings and seat occupancy
  - Track revenue and analytics

- **Technical Features:**
  - Real-time seat availability updates using Socket.io
  - Temporary seat blocking to prevent double bookings
  - JWT-based authentication and authorization
  - RESTful API with comprehensive documentation
  - Responsive design for all devices

## 🛠️ Tech Stack

**Frontend:**
- React 19 with Vite
- TailwindCSS for styling
- Zustand for state management
- React Router for navigation
- Socket.io Client for real-time updates

**Backend:**
- Node.js & Express.js
- Prisma ORM with MySQL
- JWT for authentication
- Socket.io for real-time features
- Swagger for API documentation

## 📁 Project Structure

```
QuickBook/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── admin/
│   │   ├── api/
│   │   └── store/
│   └── package.json
├── backend/           # Node.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── utils/
│   ├── prisma/
│   └── package.json
└── README.md
```

## 🎯 Implemented Features

### User Features
- ✅ **User Authentication** - Secure signup/login with JWT tokens
- ✅ **Movie Browsing** - View all available movies with detailed information
- ✅ **Cinema & Show Listings** - Browse cinemas and showtimes by location
- ✅ **Interactive Seat Selection** - Visual seat map with real-time availability
- ✅ **Real-time Updates** - Live seat availability using Socket.io
- ✅ **Seat Hold System** - Temporary seat blocking to prevent double bookings
- ✅ **Booking Management** - Create bookings and view booking history
- ✅ **Booking Cancellation** - Cancel existing bookings
- ✅ **Responsive Design** - Fully responsive across all devices

### Admin Features
- ✅ **Dashboard Analytics** - Revenue tracking, booking metrics, and insights
- ✅ **Movie Management** - Complete CRUD operations for movies
- ✅ **Cinema Management** - Add, edit, and manage cinema locations
- ✅ **Screen Management** - Configure screens within cinemas
- ✅ **Show Scheduling** - Create and manage movie showtimes
- ✅ **Booking Monitoring** - View all bookings with detailed seat information
- ✅ **Live Seat Tracking** - Real-time seat occupancy monitoring with user details
- ✅ **Role-based Access Control** - Separate admin and user permissions

### Technical Features
- ✅ **Real-time Communication** - Socket.io for instant updates
- ✅ **RESTful API** - Complete backend API with proper error handling
- ✅ **API Documentation** - Interactive Swagger/OpenAPI documentation
- ✅ **Database Transactions** - ACID compliance for data consistency
- ✅ **Input Validation** - Server-side validation with Express Validator
- ✅ **Security** - Password hashing, JWT authentication, CORS protection
- ✅ **State Management** - Zustand for efficient client-side state
- ✅ **Error Handling** - Comprehensive error management throughout

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amansingh4012/QuickBook.git
   cd QuickBook
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configuration
   # DATABASE_URL="mysql://user:password@localhost:3306/quickbook_db"
   # JWT_SECRET="your-secret-key"
   # PORT=3000
   
   npx prisma migrate dev
   npx prisma generate
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file
   # VITE_API_BASE_URL=http://localhost:3000/api
   
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - API Documentation: http://localhost:3000/api-docs

## 🏗️ Architecture & Technical Highlights

### Database Schema
- **Users** - Authentication and role management
- **Movies** - Movie catalog with metadata
- **Cinemas** - Multiple cinema locations
- **Screens** - Screen configuration per cinema
- **Shows** - Scheduled movie showtimes
- **Bookings** - User reservations with seat information
- **SeatHolds** - Temporary seat blocking with expiration

### Key Technical Implementations
- **Concurrency Management** - Handles multiple users booking simultaneously
- **Real-time WebSocket Communication** - Instant seat availability updates
- **Transaction Management** - Ensures data consistency during bookings
- **Seat Hold System** - Prevents double bookings with automatic expiration
- **JWT Authentication** - Secure token-based authentication
- **Role-based Authorization** - Separate user and admin access levels
- **API Documentation** - Complete Swagger documentation for all endpoints
- **Error Handling** - Consistent error responses across the application

## 🚀 What This Project Demonstrates

- Full-stack JavaScript development with React and Node.js
- Real-time web applications using WebSockets (Socket.io)
- Complex database design with relational data using Prisma ORM
- RESTful API design with comprehensive documentation
- Authentication and authorization patterns
- State management in React using Zustand
- Modern CSS with TailwindCSS
- Building scalable and maintainable applications

## � Future Enhancements

While the core functionality is complete, potential future improvements include:

- Payment gateway integration (Stripe, Razorpay)
- Email/SMS notifications for booking confirmations
- QR code generation for tickets
- Mobile app (React Native)
- Advanced analytics and reporting
- Movie recommendations based on user preferences
- Multi-language support
- Social media integration
- Seat preference suggestions

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/amansingh4012/QuickBook/issues).

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Aman Kumar Singh**
- GitHub: [@amansingh4012](https://github.com/amansingh4012)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/amansingh4012) *(update with your profile)*

## 📧 Contact

For any queries or suggestions, feel free to reach out!

---

**⭐ If you found this project helpful, please consider giving it a star!**

*Last Updated: October 2025*
