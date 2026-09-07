# 🚀 DevConnect

DevConnect is a full-stack developer community platform designed to bring
social networking, technical Q&A, AI-powered content discovery, and hackathon
participation together in one place.

The platform helps developers:

- 👥 Connect with other developers
- 💬 Exchange technical knowledge
- ❓ Ask and answer technical questions
- 🤖 Discover content using AI-powered tags
- 🚀 Discover and participate in hackathons
- 🔔 Stay updated through notifications
- 🧑‍💻 Build and grow their developer community

---

## ✨ Features

### 👤 Authentication & Profiles

- User signup and signin
- JWT-based authentication
- Secure password hashing with bcrypt
- Developer profiles
- Profile management
- Follow / unfollow developers

### 📝 Posts & Social Interactions

- Create and share posts
- View posts from other developers
- Like / unlike posts
- Comment on posts
- Follow developers
- Interact with the developer community

### ❓ Technical Q&A

- Ask technical questions
- Post and manage answers
- Upvote / downvote questions and answers
- Mark accepted answers
- Search questions
- Tag-based question discovery

### 🤖 AI-Powered Tags

- Automatically generate relevant tags
- Improve content categorization
- Make technical discussions easier to discover
- Help developers find relevant discussions faster

### 🚀 Hackathons

- Discover upcoming hackathons
- Search and explore hackathons
- View hackathon information
- Register and participate in hackathons

### 🔔 Notifications

- Activity notifications
- Follow notifications
- Post and interaction updates
- Unread notification count

### ⚙️ Settings

- Manage account settings
- Update profile information
- Manage account details

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | UI development |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| JavaScript | Application logic |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| express-rate-limit | API rate limiting |

### Database

- MongoDB
- Mongoose

### AI

- AI-powered tag generation

---

### 🚀 Getting Started
- 1. Clone the repository
       - git clone <your-repository-url>
- 2. Navigate to the project
      - cd DevConnect
- 3. Install backend dependencies
      - npm install
- 4. Configure environment variables
     -  Create a .env file:
        - PORT=3000
        - MONGODB_URI=your_mongodb_connection_string
        - JWT_SECRET=your_jwt_secret

- Add any other environment variables required by your project.

- 5. Start the backend
      - npm run dev

- The backend will run on:
- http://localhost:3000

- 6. Start the frontend
      - Open another terminal:
        - cd devconnect-client
        - npm install
        - npm run dev
