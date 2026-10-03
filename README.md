# 🚗 CampusRide

CampusRide is a college-focused carpooling website that I built to make it easier for students to share rides with each other.

The main idea is simple — one student can offer a ride, another student can find that ride and send a request, and the person offering the ride can accept or reject the request.

I built this project as a full-stack application to learn and work with frontend development, backend APIs, authentication, databases, and deployment.

---

## 🌐 Live Project

**Frontend:**  
https://campus-ride-orpin.vercel.app

**Backend:**  
https://campusride-production-1b98.up.railway.app

---

## 💡 What is CampusRide?

Students often travel to and from college from different locations. Instead of everyone travelling separately, CampusRide provides a simple platform where students can share rides.

For example:

- A student is travelling from Ameerpet to Anurag University.
- They can create a ride on CampusRide.
- Other students can find that ride.
- A student can request to join the ride.
- The person who created the ride can accept or reject the request.
- Accepted rides are shown in the user's rides section.

The goal was to keep the application simple and practical rather than adding unnecessary features.

---

## ✨ Features

### Authentication

- User registration
- User login
- JWT authentication
- Password encryption
- Logout
- Protected pages

### Rides

- Offer a ride
- Find available rides
- View ride information
- Request a ride
- Accept ride requests
- Reject ride requests
- Manage available seats

### User

- Dashboard
- My Rides
- Profile
- Ride request management

---

## 🛠️ Technologies I Used

### Frontend

- React.js
- React Router
- Axios
- CSS
- Vite

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT

### Database

- MySQL
- Hibernate / JPA

### Deployment

- Vercel for the frontend
- Railway for the backend
- Railway MySQL for the database

---

## 🔄 How CampusRide Works

The basic flow of the application is:

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Offer a Ride / Find a Ride
   ↓
Request a Ride
   ↓
Driver receives the request
   ↓
Accept / Reject
   ↓
Ride status gets updated
   ↓
View in My Rides
```

---

## 🏗️ Project Structure

```text
CampusRide/
│
├── backend-ride/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── campusride/
│   │       │           ├── config/
│   │       │           ├── controller/
│   │       │           ├── dto/
│   │       │           ├── entity/
│   │       │           ├── repository/
│   │       │           ├── security/
│   │       │           └── service/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── page/
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    │
    ├── package.json
    └── vercel.json
```

---

## 🔐 Authentication

For authentication, I used **Spring Security and JWT**.

When a user logs in:

```text
Email + Password
       ↓
Spring Boot
       ↓
Check user credentials
       ↓
Generate JWT
       ↓
Send token to frontend
```

The token is then used when accessing protected backend APIs.

Passwords are stored using BCrypt hashing instead of storing them as plain text.

---

## 🗄️ Database

CampusRide uses **MySQL** as the database.

The main entities used in the application are:

- User
- Ride
- Ride Booking Request

Spring Data JPA and Hibernate are used to communicate with the database.

---

## 🚀 Running the Project Locally

### Backend

Go to the backend folder:

```bash
cd backend-ride
```

Then run:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:4040
```

### Frontend

Go to the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Then start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 🧪 What I Tested

I tested the complete application after deploying it.

The following features are working:

- ✅ Registration
- ✅ Login
- ✅ Dashboard
- ✅ Offer Ride
- ✅ Find Ride
- ✅ Request Ride
- ✅ Accept Request
- ✅ Reject Request
- ✅ My Rides
- ✅ Profile
- ✅ Logout
- ✅ Protected routes

---

## 📚 What I Learned From This Project

This project helped me understand how different parts of a full-stack application work together.

While building CampusRide, I worked with:

- React frontend development
- REST APIs
- Spring Boot
- Spring Security
- JWT authentication
- MySQL
- JPA and Hibernate
- Axios API integration
- CORS
- Git and GitHub
- Vercel deployment
- Railway deployment
- Connecting frontend, backend and database in production

One of the important things I learned was that building a project isn't only about writing code. I also had to understand deployment, API communication, authentication, database connections, and debugging production errors.

---

## 🎯 Why I Built CampusRide

I wanted to build something related to a real problem that students can actually face instead of creating only a basic CRUD application.

CampusRide started as a simple idea and became a complete full-stack application with authentication, ride management, request handling, database integration, and live deployment.

I also wanted this project to help me improve my practical development skills and give me something meaningful to showcase in my portfolio.

---

## 👨‍💻 About Me

I'm a B.Tech student specializing in **Artificial Intelligence and Machine Learning**, and I'm currently learning full-stack development and building projects to improve my practical skills.

CampusRide is one of the projects I worked on to understand how a real web application is developed from the frontend all the way to deployment.

---

## 📌 Future Improvements

Some features I may explore in future versions include:

- Better ride search and filtering
- Location-based ride discovery
- Improved user experience
- Ride notifications
- More detailed ride management

For the current version, I focused on getting the core ride-sharing workflow working properly.

---

## 📄 License

This project was created for learning, educational, and portfolio purposes.
