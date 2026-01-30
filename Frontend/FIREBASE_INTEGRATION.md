# Firebase Integration Guide

This document explains how the Firebase backend has been integrated into your Go-Neer application.

## 🔄 What's Been Integrated

### 1. **Authentication (AuthContext)**

The existing `AuthContext` has been updated to use Firebase Authentication instead of mock data.

**Changes:**

- `login()` - Uses Firebase Authentication
- `signup()` - Creates user account in Firebase + profile in Firestore
- `signOut()` - Firebase sign out
- `updateProfile()` - Updates user profile in Firestore

**Usage:**

```jsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, profile, login, signup, signOut } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {profile?.displayName}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### 2. **Login Page**

Updated [src/pages/auth/Login.jsx](src/pages/auth/Login.jsx) to:

- Use Firebase Authentication for login
- Fetch user profile from Firestore
- Redirect based on role (user/vendor/admin)

### 3. **Signup Page**

Updated [src/pages/auth/Signup.jsx](src/pages/auth/Signup.jsx) to:

- Create new Firebase user account
- Store user profile in Firestore with role
- Support both customer and vendor registration

## 📦 Available Services

### Authentication Service

**File:** `src/services/authService.js`

```javascript
import {
  signUp,
  signIn,
  signOut,
  onAuthChange,
  getCurrentUser,
} from "@/services/authService";

// Sign up new user
const { user } = await signUp("email@example.com", "password123");

// Sign in
const { user } = await signIn("email@example.com", "password123");

// Sign out
await signOut();

// Listen to auth changes
const unsubscribe = onAuthChange((user) => {
  console.log("Auth state changed:", user);
});
```

### Firestore Service

**File:** `src/services/firestoreService.js`

```javascript
import {
  addDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} from "@/services/firestoreService";

// Add a new document
const docId = await addDocument("vendors", {
  storeName: "Fresh Water Co",
  description: "Best water delivery",
});

// Get all documents
const vendors = await getDocuments("vendors");

// Get single document
const vendor = await getDocument("vendors", "vendor123");

// Update document
await updateDocument("vendors", "vendor123", {
  rating: 4.5,
});

// Delete document
await deleteDocument("vendors", "vendor123");

// Query with conditions
const results = await queryDocuments("products", {
  where: ["vendorId", "==", "vendor123"],
  orderBy: ["price", "asc"],
  limit: 10,
});
```

### Storage Service

**File:** `src/services/storageService.js`

```javascript
import {
  uploadFile,
  getFileURL,
  deleteFile,
  uploadMultipleFiles,
} from "@/services/storageService";

// Upload single file
const imageUrl = await uploadFile(file, "vendors/vendor123/logo.jpg");

// Get file URL
const url = await getFileURL("vendors/vendor123/logo.jpg");

// Delete file
await deleteFile("vendors/vendor123/logo.jpg");

// Upload multiple files
const urls = await uploadMultipleFiles([file1, file2], "products");
```

### User Service

**File:** `src/services/userService.js`

```javascript
import {
  createVendorProfile,
  createCustomerProfile,
  getUserStats,
} from "@/services/userService";

// Create vendor profile after signup
await createVendorProfile(userId, {
  storeName: "My Store",
  description: "Great products",
  location: { lat: 40.7128, lng: -74.006 },
});

// Get user stats
const stats = await getUserStats(userId);
```

## 🪝 Available Hooks

### useAuth Hook

**File:** `src/hooks/useAuth.js`

```javascript
import { useAuth } from '@/hooks/useAuth'

function LoginForm() {
  const { user, loading, error, signup, login, logout } = useAuth()

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    // Your component
  )
}
```

### useFirestore Hook

**File:** `src/hooks/useFirestore.js`

```javascript
import { useFirestore } from '@/hooks/useFirestore'

function VendorsList() {
  const {
    documents: vendors,
    loading,
    error,
    addDoc,
    updateDoc,
    deleteDoc,
    queryDocs
  } = useFirestore('vendors')

  const addVendor = async () => {
    await addDoc({
      storeName: 'New Store',
      description: 'A great store'
    })
  }

  return (
    // Your component
  )
}
```

## 🗄️ Firestore Collections Structure

### `users` Collection

```
users/
├── {userId}
│   ├── email: string
│   ├── displayName: string
│   ├── role: "customer" | "vendor" | "admin"
│   ├── photoURL: string (optional)
│   └── createdAt: timestamp
```

### `vendors` Collection

```
vendors/
├── {docId}
│   ├── userId: string (reference to users)
│   ├── storeName: string
│   ├── description: string
│   ├── location: geopoint (optional)
│   ├── rating: number
│   ├── totalOrders: number
│   ├── image: string (URL)
│   └── createdAt: timestamp
```

### `products` Collection

```
products/
├── {docId}
│   ├── vendorId: string (reference to vendors)
│   ├── name: string
│   ├── description: string
│   ├── price: number
│   ├── image: string (URL)
│   ├── category: string
│   └── createdAt: timestamp
```

### `orders` Collection

```
orders/
├── {docId}
│   ├── userId: string (reference to users)
│   ├── vendorId: string (reference to vendors)
│   ├── items: array
│   ├── totalAmount: number
│   ├── status: "pending" | "confirmed" | "delivered"
│   ├── deliveryAddress: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

## 🔐 Security Rules (Development)

Your Firestore security rules (from `FIREBASE_SETUP.md`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /vendors/{vendorId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.userId;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth.uid == get(/databases/$(database)/documents/vendors/$(request.resource.data.vendorId)).data.userId;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🚀 How to Use in Your Components

### Example: Product Listing Component

```jsx
import { useFirestore } from "@/hooks/useFirestore";

export default function ProductsList() {
  const { documents: products, loading, error } = useFirestore("products");

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
          {product.image && <img src={product.image} alt={product.name} />}
        </div>
      ))}
    </div>
  );
}
```

### Example: Add Vendor Form

```jsx
import { useState } from "react";
import { createVendorProfile } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";

export default function AddVendorForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createVendorProfile(user.uid, formData);
      alert("Vendor profile created!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Store Name"
        value={formData.storeName}
        onChange={(e) =>
          setFormData({ ...formData, storeName: e.target.value })
        }
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Vendor Profile"}
      </button>
    </form>
  );
}
```

## ⚠️ Important Notes

1. **Environment Variables**: Make sure `.env.local` has your Firebase credentials
2. **Authentication Required**: Most operations require the user to be authenticated
3. **Error Handling**: Always wrap Firebase operations in try-catch blocks
4. **Real-time Updates**: Use `queryDocuments` or set up listeners for real-time data
5. **File Uploads**: Use `uploadFile` from storage service for images/files

## 🔧 Next Steps

1. **Update your existing pages** to use `useFirestore` hook instead of mock data
2. **Implement image uploads** for vendor logos and product images
3. **Set up real-time listeners** for live order updates
4. **Add validation** for form inputs before saving to Firestore
5. **Implement search and filtering** using Firestore queries

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Firebase Storage](https://firebase.google.com/docs/storage)
- [Firebase Auth Best Practices](https://firebase.google.com/docs/auth/best-practices)

## 🆘 Troubleshooting

### "VITE_FIREBASE_API_KEY is not defined"

- Check `.env.local` file has all required Firebase credentials
- Restart the dev server after updating `.env.local`

### "Permission denied" errors

- Check Firestore security rules in Firebase Console
- Ensure user is authenticated
- Verify user has permission to access the collection

### "Document not found"

- Check that the document ID is correct
- Verify the collection name is spelled correctly
- Ensure the document exists in Firestore

### "File upload fails"

- Check Cloud Storage is enabled in Firebase Console
- Verify the file path is correct
- Check storage bucket exists and is configured
