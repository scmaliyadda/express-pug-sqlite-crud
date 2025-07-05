# Express.js + Pug + SQLite Admin Dashboard

A minimal user management web app using Express.js, Sequelize ORM with SQLite, Pug templates, and Bootstrap 5.

## 🚀 Features

- 📝 User registration and login
- 🔒 Session-based authentication
- 🔐 Role-based access control (admin/user)
- 👤 Admin dashboard:
  - View all users
  - Create new users
  - Edit or delete users
- 💬 Flash messages for feedback
- 🎨 Clean responsive UI with Bootstrap
- 📁 Static file support (CSS)
- 🗄️ Sequelize ORM + SQLite database

## 🛠 Tech Stack & Express Middleware

| Feature              | Module Used                     |
|---------------------|----------------------------------|
| Web framework       | [Express.js](https://expressjs.com) |
| Template engine     | [Pug](https://pugjs.org)         |
| Session management  | `express-session` + `connect-sqlite3` |
| Password hashing    | `bcrypt`                         |
| ORM & DB            | `sequelize` + `sqlite3`          |
| Flash messages      | `req.session.flash` (custom usage) |
| Live reload (dev)   | `nodemon` (dev dependency)       |

## 📂 Project Structure

```
├── index.js             # Main Express app
├── models/              # Sequelize models
│   └── index.js
├── views/               # Pug templates
├── public/              # Static files (e.g. styles.css)
├── database.sqlite      # SQLite DB (auto-generated)
├── seed-admin.js        # Admin user seeding script
├── package.json
└── README.md
```

## ⚙️ Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Seed an admin user:**
   ```bash
   node seed-admin.js
   ```

3. **Start the app:**
   ```bash
   npm run dev
   ```

4. **Access:**
   Open `http://localhost:3000` in your browser.

## 🔐 Default Admin Credentials

- **Username:** `admin`
- **Password:** `adminpass`

(You can update this in `seed-admin.js`)

---

## 📝 License

MIT License
