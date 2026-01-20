# Firebase Setup Guide for Go-Neer

This guide will help you set up Firebase as the backend for your Go-Neer application.

## Prerequisites

- Firebase account (create one at https://firebase.google.com)
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "Go-Neer")
4. Accept the terms and create the project
5. Wait for the project to be created

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web** icon (</> symbol)
2. Register your app with a nickname (e.g., "Go-Neer Web")
3. Copy the Firebase configuration
4. You'll see something like:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
   };
   ```

## Step 3: Configure Environment Variables

1. Open `Frontend/.env.local` file
2. Replace the placeholder values with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```

## Step 4: Enable Firebase Services

### Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** provider:
   - Click **Email/Password** from the Sign-in method list
   - Enable it and save

### Enable Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click **"Create Database"**
3. Select **Start in production mode** (or test mode for development)
4. Choose your database location
5. Click **Enable**

### Enable Cloud Storage (Optional)

1. In Firebase Console, go to **Build > Storage**
2. Click **"Get started"**
3. Accept the default rules
4. Choose your storage location
5. Click **Done**

## Step 5: Configure Firestore Security Rules (Development)

For development, use these permissive rules (⚠️ Not for production):

1. Go to **Build > Firestore Database > Rules**
2. Replace the default rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
3. Click **Publish**

## Project Structure

The Firebase integration includes:

```
Frontend/
├── src/
│   ├── config/
│   │   └── firebase.js           # Firebase initialization
│   ├── services/
│   │   ├── authService.js        # Authentication functions
│   │   ├── firestoreService.js   # Firestore CRUD operations
│   │   └── storageService.js     # Cloud Storage operations
│   └── hooks/
│       ├── useAuth.js            # Authentication hook
│       └── useFirestore.js       # Firestore data hook
├── .env.local                    # Environment variables (your Firebase config)
└── package.json                  # Updated with Firebase dependency
```

## Usage Examples

### Authentication

```jsx
import { useAuth } from "@/hooks/useAuth";

function LoginComponent() {
  const { user, login, logout, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login("user@example.com", "password123");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Firestore Operations

```jsx
import { useFirestore } from "@/hooks/useFirestore";

function ProductsComponent() {
  const { documents, loading, addDoc, updateDoc, deleteDoc } =
    useFirestore("products");

  const addProduct = async () => {
    await addDoc({
      name: "Pizza",
      price: 10.99,
      description: "Delicious pizza",
    });
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {documents.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      )}
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}
```

### File Upload

```jsx
import { uploadFile } from "@/services/storageService";

function ImageUpload() {
  const handleUpload = async (file) => {
    try {
      const url = await uploadFile(file, `products/${file.name}`);
      console.log("File uploaded:", url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
  );
}
```

## Database Structure (Recommended)

Create these Firestore collections:

### `users` Collection

```
users/
├── {userId}
│   ├── email: string
│   ├── displayName: string
│   ├── role: "customer" | "vendor" | "admin"
│   ├── createdAt: timestamp
│   └── photoURL: string
```

### `vendors` Collection

```
vendors/
├── {vendorId}
│   ├── userId: string (reference to users)
│   ├── storeName: string
│   ├── description: string
│   ├── location: geopoint
│   ├── rating: number
│   ├── image: string (URL)
│   └── createdAt: timestamp
```

### `products` Collection

```
products/
├── {productId}
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
├── {orderId}
│   ├── userId: string (reference to users)
│   ├── vendorId: string (reference to vendors)
│   ├── items: array
│   ├── totalAmount: number
│   ├── status: "pending" | "confirmed" | "delivered"
│   ├── deliveryAddress: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

### `cart` Collection

```
cart/
├── {userId}
│   ├── items: array
│   │   ├── productId: string
│   │   ├── quantity: number
│   │   └── price: number
│   └── updatedAt: timestamp
```

## Security Rules for Production

For production, use these security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Everyone can read vendors
    match /vendors/{vendorId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.userId;
    }

    // Everyone can read products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth.uid == get(/databases/$(database)/documents/vendors/$(request.resource.data.vendorId)).data.userId;
    }

    // Users can read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    // Users can read/write their own cart
    match /cart/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Next Steps

1. Update your authentication components to use `useAuth` hook
2. Update your context files to use Firebase services
3. Replace mock data with Firestore queries
4. Implement file uploads for product images
5. Add error handling and loading states

## Troubleshooting

### "FIREBASE_API_KEY is not defined"

- Check that `.env.local` file exists
- Verify all environment variable names start with `VITE_`
- Restart the development server after updating `.env.local`

### "Firebase is not initialized"

- Ensure Firebase credentials are correct in `.env.local`
- Check that your Firebase project has the required services enabled

### "Permission denied" errors

- Update Firestore security rules
- Ensure user is authenticated for operations requiring auth
- Check that user ID matches the document being accessed

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
