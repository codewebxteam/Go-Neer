import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

// --- USER MANAGEMENT ---

/**
 * Toggle user active status
 * @param {string} userId 
 * @param {boolean} currentStatus 
 */
export const toggleUserStatus = async (userId, currentStatus) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            is_active: !currentStatus,
            updated_at: serverTimestamp()
        });
        return !currentStatus;
    } catch (error) {
        console.error("Error toggling user status:", error);
        throw error;
    }
};

/**
 * Delete a user profile permanently
 * @param {string} userId 
 */
export const deleteUser = async (userId) => {
    try {
        await deleteDoc(doc(db, "users", userId));
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

// --- VENDOR MANAGEMENT ---

/**
 * Verify a vendor account
 * @param {string} vendorId 
 */
export const verifyVendor = async (vendorId) => {
    try {
        const vendorRef = doc(db, "vendors", vendorId);
        await updateDoc(vendorRef, {
            is_verified: true,
            is_active: true, // Auto-activate upon verification
            updated_at: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error verifying vendor:", error);
        throw error;
    }
};

/**
 * Toggle vendor active status
 * @param {string} vendorId 
 * @param {boolean} currentStatus 
 */
export const toggleVendorStatus = async (vendorId, currentStatus) => {
    try {
        const vendorRef = doc(db, "vendors", vendorId);
        await updateDoc(vendorRef, {
            is_active: !currentStatus,
            updated_at: serverTimestamp()
        });
        return !currentStatus;
    } catch (error) {
        console.error("Error toggling vendor status:", error);
        throw error;
    }
};

/**
 * Delete a vendor profile permanently
 * @param {string} vendorId 
 */
export const deleteVendor = async (vendorId) => {
    try {
        await deleteDoc(doc(db, "vendors", vendorId));
        return true;
    } catch (error) {
        console.error("Error deleting vendor:", error);
        throw error;
    }
};
