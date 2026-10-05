# MindBridge – AI-Powered Mental Health Support System

MindBridge is an AI-powered mental health support application designed to provide students with accessible mental health resources, self-assessment tools, AI-based support, and secure communication with counselors and volunteers.

The application combines a mobile frontend, REST API backend, database security, authentication, and AI integration into a single platform.

---

## 🚀 Features

### 🔐 Secure Authentication
- OTP-based authentication
- Role-based access control
- Face verification / biometric authentication
- Secure user sessions
- Different access levels for students, volunteers, moderators, and administrators

### 🤖 AI-Powered Chatbot – Aria
- AI-powered mental health support chatbot
- Built using Google's Gemini AI
- Supports English and Tamil
- Provides supportive responses and guidance
- Designed to identify situations where professional/crisis support may be required

### 🧠 Mental Health Assessments
Integrated self-assessment questionnaires including:

- PHQ-9 – Depression assessment
- GAD-7 – Anxiety assessment
- GHQ-12 – General mental health assessment

Users can complete assessments and view their results.

### 👨‍⚕️ Counselor Support
- Anonymous counselor booking
- Connect students with available counselors
- Appointment management
- Privacy-focused interaction

### 💬 Community Forum
- Students can participate in discussions
- Community-based peer support
- Moderation features for maintaining a safe environment

### 📊 Admin & Moderator Features
- User management
- Role-based permissions
- Forum moderation
- Application analytics
- Monitoring of platform activity

### 🔔 Notifications
- Push notifications using Expo Notifications
- Notifications for relevant application activities and updates

### 🔒 Data Security
- Supabase PostgreSQL database
- Row Level Security (RLS)
- Role-based authorization
- Secure API communication
- Sensitive biometric data protected using encryption techniques

---

## 🛠️ Tech Stack

### Frontend
- React Native
- Expo
- JavaScript

### Backend
- Node.js
- Express.js
- REST APIs
- MVC Architecture

### Database
- Supabase
- PostgreSQL
- Row Level Security (RLS)

### AI
- Google Gemini API
- Gemini AI-powered chatbot

### Authentication & Security
- OTP Authentication
- Role-Based Access Control
- Face Verification
- Biometric Authentication
- Secure session management
- AES-256 encryption for sensitive biometric descriptors

### Development Tools
- Git
- GitHub
- Visual Studio Code
- Postman

---

## 🏗️ System Architecture

``
                ┌─────────────────────┐
                │     React Native    │
                │       + Expo        │
                └──────────┬──────────┘
                           │
                           │ REST API
                           ▼
                ┌─────────────────────┐
                │    Node.js +        │
                │    Express.js       │
                │    MVC Backend      │
                └───────┬─────┬───────┘
                        │     │
             ┌──────────┘     └────────────┐
             ▼                             ▼
   ┌──────────────────┐          ┌─────────────────┐
   │    Supabase      │          │   Gemini AI     │
   │   PostgreSQL     │          │    Chatbot      │
   │      + RLS       │          │     Aria        │
   └──────────────────┘          └─────────────────┘



📱 Application Modules
Student Module
Students can:

Create and manage their account

Complete mental health assessments

Chat with the AI assistant

Access mental health resources

Book counselors

Participate in community discussions

Receive notifications

Volunteer Module
Volunteers can:

Access assigned support activities

Interact with students according to their permissions

Manage relevant support tasks

Moderator Module
Moderators can:

Review community content

Manage inappropriate posts

Maintain community safety

Admin Module
Administrators can:

Manage users

Manage roles

Monitor application activity

Access analytics

Manage platform-level settings

🧩 Project Structure
MindBridge/
│
├── frontend/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   ├── hooks/
│   └── assets/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── config/
│
├── README.md
└── package.json
Project structure may vary depending on the current version of the repository.

🔄 How It Works
User registers/logs into the application.

Authentication and authorization determine the user's role.

The React Native application communicates with the Node.js/Express backend through REST APIs.

Backend services process requests and communicate with Supabase PostgreSQL.

Row Level Security helps restrict database access according to user permissions.

The AI chatbot communicates with Gemini AI to generate supportive responses.

Users can access assessments, resources, counseling, forums, and other features based on their role.

🤖 AI Integration
MindBridge integrates Gemini AI to provide an AI-based conversational support system called Aria.

The chatbot is designed to:

Understand user messages

Provide supportive conversational responses

Support English and Tamil

Provide relevant mental health resources

Direct users toward professional/crisis support when appropriate

The AI assistant is intended as a support tool and does not replace qualified mental health professionals.

🔐 Security Considerations
Security was an important part of the application design.

The project implements:

Authentication and authorization

Role-based access control

Supabase Row Level Security

Protected API endpoints

Secure session handling

Biometric/face verification

Encryption of sensitive biometric descriptors

Controlled access to user information

💻 Installation & Setup
1. Clone the repository
git clone https://github.com/jaswanth91/mindbridge-application.git

cd mindbridge-application
2. Install frontend dependencies
npm install
3. Install backend dependencies
cd backend
npm install
4. Configure environment variables
Create a .env file for the backend.

Example:

PORT=5000

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

GEMINI_API_KEY=your_gemini_api_key

JWT_SECRET=your_jwt_secret
Do not commit API keys, passwords, JWT secrets, or other sensitive credentials to GitHub.

5. Start the backend
npm start
6. Start the Expo application
From the frontend/project directory:

npx expo start
Then run the application using:

Android Emulator

iOS Simulator

Expo Go

🌐 API Architecture
The backend follows a REST API architecture using Node.js and Express.js.

Example API categories:

/api/auth
/api/users
/api/assessments
/api/chat
/api/counselors
/api/bookings
/api/forum
/api/notifications
/api/admin
The exact endpoints may change as the project evolves.

📚 Key Concepts Demonstrated
This project demonstrates practical knowledge of:

React Native development

REST API development

Node.js & Express.js

MVC architecture

Database design

PostgreSQL

Supabase

Row Level Security

Authentication

Authorization

Role-Based Access Control

AI API integration

Gemini API

Mobile application development

Secure API communication

Git & GitHub

Third-party API integration

🎯 My Contribution
I worked on the design and development of the MindBridge application, including:

React Native mobile application development

Backend development using Node.js and Express.js

REST API development

Supabase/PostgreSQL database integration

Authentication and authorization

Role-based access control

AI chatbot integration using Gemini API

Mental health assessment implementation

API integration and application logic

Testing and debugging

Git/GitHub based development

🔮 Future Improvements
Possible future improvements include:

Advanced AI-powered personalization

Improved analytics dashboard

Real-time counselor communication

Voice-based AI interaction

Improved crisis detection and escalation

Additional regional language support

Enhanced notification system

Deployment of production-ready infrastructure

📸 Screenshots
Add screenshots of the application here.

Example:

screenshots/
├── login.png
├── home.png
├── chatbot.png
├── assessment.png
├── counselor.png
└── forum.png
⚠️ Disclaimer
MindBridge is an educational/project application designed to demonstrate the use of mobile development, backend systems, databases, and AI technologies for mental health support.

It is not intended to replace professional medical or psychological advice.

If someone is experiencing a mental health emergency, they should contact a qualified healthcare professional or appropriate emergency service.

👨‍💻 Developer
Jaswanth Challagondla

B.Tech Computer Science & Engineering (AI)
Saveetha School of Engineering

GitHub:
https://github.com/jaswanth91

