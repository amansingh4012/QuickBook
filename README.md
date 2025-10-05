# QuickBook - Cinema Booking System 🎬

> **⚠️ PROJECT UNDER DEVELOPMENT** - This is an ongoing project and features are being actively developed.

## 📖 About This Project

QuickBook is a modern cinema ticket booking application being built with React, Node.js, and MySQL. The goal is to create a full-stack platform where users can browse movies, select seats in real-time, and make bookings - all while cinema administrators can manage their operations efficiently.

This project is a learning journey in building production-quality web applications with modern technologies and best practices.

## 🎯 What I'm Building

A cinema booking system that includes:

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

## 🚧 Current Status

**What's Working:**
- ✅ User authentication (login/signup)
- ✅ Movie browsing and details
- ✅ Cinema and show listings
- ✅ Interactive seat selection
- ✅ Basic booking functionality
- ✅ Admin dashboard basics
- ✅ Real-time seat updates

**In Progress:**
- 🔄 Enhanced admin analytics
- 🔄 Advanced booking management
- 🔄 Performance optimization
- 🔄 Comprehensive testing

**Planned:**
- 📋 Payment gateway integration
- 📋 Email notifications
- 📋 Advanced search and filters
- 📋 Mobile app version
- 📋 Multi-language support

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

## 📚 Learning Goals

Through this project, I'm gaining hands-on experience with:

- Full-stack JavaScript development
- Real-time web applications with WebSockets
- Database design and relationships with Prisma ORM
- RESTful API design and documentation
- Authentication and authorization patterns
- State management in React
- Modern CSS with TailwindCSS
- Deployment and DevOps practices

## 🎓 Why This Project?

Cinema booking systems involve interesting technical challenges:
- **Concurrency:** Multiple users booking seats simultaneously
- **Real-time Updates:** Live seat availability across sessions
- **Complex Relationships:** Movies, cinemas, screens, shows, and bookings
- **User Experience:** Intuitive booking flow with proper error handling
- **Role Management:** Different interfaces for users and administrators

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Aman Kumar Singh**
- GitHub: [@amansingh4012](https://github.com/amansingh4012)

---

*Last Updated: October 2025*

> 💡 **Note:** This project is under active development. Features and documentation are continuously being updated and improved.
