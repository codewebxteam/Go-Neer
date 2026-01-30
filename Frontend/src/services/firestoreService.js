import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Retry helper function with exponential backoff
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      // Only retry on network/offline errors
      if (error.code === 'failed-precondition' || error.code === 'unavailable' || error.message?.includes('offline')) {
        if (i < maxRetries - 1) {
          console.log(`Retry attempt ${i + 1} after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }
      }
      throw error;
    }
  }
};

// Add a new document
export const addDocument = async (collectionName, data) => {
  try {
    return await retryOperation(async () => {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Get all documents from a collection with retry
export const getDocuments = async (collectionName) => {
  try {
    return await retryOperation(async () => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
    // Return empty array instead of throwing on offline error
    if (error.message?.includes('offline') || error.code === 'failed-precondition') {
      console.warn('Firestore offline, returning empty array');
      return [];
    }
    throw error;
  }
};

// Get a single document with retry
export const getDocument = async (collectionName, docId) => {
  try {
    return await retryOperation(async () => {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      }
      return null;
    });
  } catch (error) {
    console.error("Error getting document: ", error);
    // Return null instead of throwing on offline error
    if (error.message?.includes('offline') || error.code === 'failed-precondition') {
      console.warn('Firestore offline, returning null');
      return null;
    }
    throw error;
  }
};

// Update a document with retry
export const updateDocument = async (collectionName, docId, data) => {
  try {
    return await retryOperation(async () => {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    });
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document with retry
export const deleteDocument = async (collectionName, docId) => {
  try {
    return await retryOperation(async () => {
      await deleteDoc(doc(db, collectionName, docId));
    });
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

// Query documents with retry
export const queryDocuments = async (collectionName, queryConditions) => {
  try {
    return await retryOperation(async () => {
      let q = collection(db, collectionName);
      let constraints = [];

      if (queryConditions.where) {
        constraints.push(where(...queryConditions.where));
      }

      if (queryConditions.orderBy) {
        constraints.push(orderBy(...queryConditions.orderBy));
      }

      if (queryConditions.limit) {
        constraints.push(limit(queryConditions.limit));
      }

      const queryRef = query(q, ...constraints);
      const querySnapshot = await getDocs(queryRef);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
  } catch (error) {
    console.error("Error querying documents: ", error);
    // Return empty array instead of throwing on offline error
    if (error.message?.includes('offline') || error.code === 'failed-precondition') {
      console.warn('Firestore offline, returning empty array');
      return [];
    }
    throw error;
  }
};
