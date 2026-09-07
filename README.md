🚀 DevConnect

A developer community platform to connect, share, learn, and build together.

DevConnect is a full-stack developer community application that combines social networking, technical Q&A, and hackathon discovery in one platform.

✨ Features
👤 Authentication — Signup, signin, JWT, profiles, follow/unfollow
📝 Posts — Create posts, likes, comments, and interactions
❓ Q&A — Questions, answers, voting, accepted answers, search & tags
🤖 AI Tags — Automatically generate tags for questions and answers
🏆 Hackathons — Discover, create, search, register, and participate
🔔 Notifications — Activity notifications and unread count
⚙️ Settings — Account management
🛠️ Tech Stack

Frontend: React, React Router, Tailwind CSS, JavaScript
Backend: Node.js, Express.js, MongoDB, Mongoose
Authentication: JWT, bcrypt
Validation & Security: Zod, express-rate-limit
AI: AI-powered tag generation

▶️ How to Run
1. Clone the repository
git clone <your-repository-url>
cd DevConnect

2. Setup Backend
cd Backend
npm install
npm run dev


Create a .env file in the Backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_api_key

3. Setup Frontend

Open a new terminal:

cd Frontend
npm install
npm run dev


The application will be available at the URL shown by the Vite development server.

🎯 Goal

DevConnect brings developers together in one platform to:

Connect → Learn → Share → Build → Participate → Grow

🚧 Status

Actively under development.
