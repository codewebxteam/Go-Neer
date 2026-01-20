import { useState, useEffect } from "react";
import {
  getDocuments,
  getDocument,
  queryDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../services/firestoreService";

// Hook for fetching documents from Firestore
export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const docs = await getDocuments(collectionName);
        setDocuments(docs);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (collectionName) {
      fetchDocuments();
    }
  }, [collectionName]);

  const addDoc = async (data) => {
    try {
      setLoading(true);
      const docId = await addDocument(collectionName, data);
      const newDoc = { id: docId, ...data };
      setDocuments([...documents, newDoc]);
      return docId;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDoc = async (docId, data) => {
    try {
      setLoading(true);
      await updateDocument(collectionName, docId, data);
      setDocuments(
        documents.map((doc) => (doc.id === docId ? { ...doc, ...data } : doc))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDoc = async (docId) => {
    try {
      setLoading(true);
      await deleteDocument(collectionName, docId);
      setDocuments(documents.filter((doc) => doc.id !== docId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDocById = async (docId) => {
    try {
      return await getDocument(collectionName, docId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const queryDocs = async (conditions) => {
    try {
      setLoading(true);
      const docs = await queryDocuments(collectionName, conditions);
      setDocuments(docs);
      return docs;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    loading,
    error,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocById,
    queryDocs,
  };
};
