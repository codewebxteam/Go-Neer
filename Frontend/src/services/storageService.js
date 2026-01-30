import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";

// Upload a file to Firebase Storage
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};

// Get download URL for a file
export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error getting file URL: ", error);
    throw error;
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file: ", error);
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (files, basePath) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
      return uploadFile(file, path);
    });
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple files: ", error);
    throw error;
  }
};
