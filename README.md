# Codnet

Codnet is a modern social platform tailored for developers and tech enthusiasts to share ideas, posts, and connect with like-minded people. Users can create profiles, post content, react with likes or dislikes, and update their bios—all in a clean and responsive React-based interface.

---

## 🛠️ Tech Stack

- **Frontend**
  - React (with hooks and context API)
  - React Router DOM for routing
  - Tailwind CSS for utility-first styling
  - React Icons for UI icons
  - Axios for HTTP requests
  - SweetAlert2 for beautiful alerts and confirmations
- **Backend**
  - Node.js with Express.js framework
  - RESTful API endpoints
- **Authentication**
  - Firebase Authentication (Email & Password)
- **Database**
  - MongoDB (Atlas or local)
- **Hosting**
  - Frontend deployed on Vercel or Netlify
  - Backend deployed on Vercel, Render, or Heroku
- **Other**
  - JWT for token-based authorization (if implemented)
  - Optional: TanStack Query for data fetching state management
  - Optional: Framer Motion for animations

---

## 🚀 Features

- **User Authentication**
  - Sign up and login via Firebase Authentication
  - Email verification and password reset support
- **Profile Management**
  - View profile info including avatar, name, email, and bio
  - Edit and update bio content dynamically
  - Update profile picture and display name (optional)
- **Posts**
  - Create new posts with text content
  - View all posts sorted by newest first
  - Like and dislike posts (counts displayed)
  - Delete own posts with confirmation dialogs
- **UI/UX**
  - Responsive design optimized for desktop and mobile
  - Loading spinners for async operations
  - SweetAlert2 modals for user-friendly confirmations and alerts
  - Clean, modern design using Tailwind CSS
- **Routing**
  - Protected routes for authenticated users
  - Layout components for consistent navigation and footer
- **Error Handling**
  - Graceful handling and display of API errors
  - Disabled buttons when input is invalid or empty

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MongoDB database (Atlas or local)
- Firebase project for authentication


