
# 🚀 RMS (Remote Monitoring System)

A web-based system for configuring and monitoring automation devices. The application supports Excel-based device configuration uploads, MQTT topic-based communication, and device management via an intuitive React-based frontend.

---

## 🛠 Tech Stack

### 🖥️ Frontend

* **React** – Component-based UI library
* **React-Bootstrap** – Bootstrap 5 components for React
* **Redux** – Global state management
* **Redux Toolkit** – Simplified Redux setup and best practices

### 🌐 Backend

* **Express.js** – Lightweight Node.js web framework
* **Prisma** – Modern ORM for SQL databases
* **MySQL** – Relational database for structured configuration and device data

---

## 📁 Project Structure

```bash
rms-system/
├── client/              # React frontend
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components (Login, File Upload, Device List)
│   │   ├── redux/       # Redux store, slices
│   │   ├── App.jsx      # Main app logic
│   │   └── main.jsx     # Entry point
├── server/              # Express backend
│   ├── src/
│   │   ├── routes/      # Express route definitions
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic (MQTT, Excel, etc.)
│   │   ├── prisma/      # Prisma schema and client
│   │   └── index.js     # Server entry point
└── README.md
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Node.js (v18+)
* MySQL 8+
* npm or yarn

---

### ⚙️ Backend Setup

1. Navigate to the backend:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Configure `.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/rms_db"
PORT=5000
```

4. Generate Prisma client and migrate schema:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Start the server:

```bash
npm start
```

---

### 💻 Frontend Setup

1. Navigate to the frontend:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

---

## 🧩 Features

### ✅ Authentication

* Simple login with hardcoded credentials or JWT (future scope)

### 📤 Device Configuration Upload

* Upload Excel files to extract MQTT settings
* Preview before saving to MySQL

### 📋 Device Management

* View all devices
* Filter by batch name
* Soft-delete, mark as inactive or released

### 🛠 MQTT Integration

* MQTT client connects to broker
* Subscribes to device topics (e.g., `heartbeat`, `pumpdata`)
* Writes incoming data to MySQL

### 📁 ACL Generation

* Generate MQTT ACL config file from DB

---

## 🔐 Environment Variables

Backend `.env` example:

```env
DATABASE_URL="mysql://user:password@localhost:3306/rms_db"
MQTT_BROKER_URL="mqtt://broker.hivemq.com"
MQTT_USERNAME="macsoft_user"
MQTT_PASSWORD="secret"
```

---

## 🧪 Testing

* Use tools like Postman for API testing
* Unit and integration tests (using Jest or Mocha - optional)

---

## 📦 Future Enhancements

* JWT authentication and user roles
* Role-based access to tabs/pages
* Excel template download
* Audit logs
* WebSocket-based live dashboard
* Export device data to CSV

---

## 📬 Contact

Maintained by \[Macsoft Automations].

For queries or contributions, feel free to open an issue or send a PR.

---

Would you like me to scaffold this as a real project (with directory structure, working boilerplate), or generate a `package.json` and `.env.example` too?
