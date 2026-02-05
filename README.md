# Go-Neer 🛒

Go-Neer is a modern full-stack web application designed to connect users and vendors on a single platform, enabling seamless product listing, ordering, and management with secure authentication and real-time data handling.

---

## 🚀 Features

- 🔐 Firebase Authentication (User & Vendor roles)
- 👤 Role-based user profiles
- 🏪 Vendor product management
- 🛍️ Product browsing & ordering
- 📦 Order tracking & management
- ☁️ Real-time database using Firebase Firestore
- ⚡ Fast, responsive UI

---

## 🗂️ Firestore Data Schema

The application is powered by **4 core Firestore collections**:

### 1️⃣ `users`
- Stores authenticated user profiles
- Linked directly with Firebase Auth
- Contains role, email, phone, address, and timestamps

### 2️⃣ `vendors`
- Stores vendor-specific information
- Created when a user registers as a vendor
- Includes shop details and verification status

### 3️⃣ `products`
- Created and managed by vendors
- Contains product details like name, price, category, stock, and images

### 4️⃣ `orders`
- Created when a user places an order
- Links users, vendors, and products
- Stores order status, payment info, and timestamps

---

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Firebase (Firestore + Auth)
- **State Management:** Context API
- **Styling:** Tailwind CSS / CSS
- **Deployment:** Firebase / Vercel (optional)

---

## 📁 Project Structure

```bash
Go-Neer/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   └── utils/
├── public/
├── firebase/
├── package.json
└── README.md
