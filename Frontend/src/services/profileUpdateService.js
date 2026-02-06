import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Update user profile in Firebase
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, profileData) => {
    try {
        const userRef = doc(db, 'users', userId)

        // Prepare update data - only update fields that are provided
        const updateData = {
            updated_at: serverTimestamp()
        }

        // Add fields if they exist in profileData
        if (profileData.full_name !== undefined) updateData.full_name = profileData.full_name
        if (profileData.phone !== undefined) updateData.phone = profileData.phone
        if (profileData.address !== undefined) updateData.address = profileData.address
        if (profileData.bio !== undefined) updateData.bio = profileData.bio

        // Update the document
        await updateDoc(userRef, updateData)

        return { success: true }
    } catch (error) {
        console.error('Error updating user profile:', error)
        throw error
    }
}

/**
 * Update vendor profile in Firebase
 * @param {string} vendorId - Vendor ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<void>}
 */
export const updateVendorProfile = async (vendorId, profileData) => {
    try {
        const vendorRef = doc(db, 'vendors', vendorId)

        // Prepare update data - handle all vendor-specific fields
        const updateData = {
            updated_at: serverTimestamp()
        }

        // Add fields if they exist in profileData
        if (profileData.full_name !== undefined) updateData.full_name = profileData.full_name
        if (profileData.phone !== undefined) updateData.phone = profileData.phone
        if (profileData.address !== undefined) updateData.address = profileData.address
        if (profileData.bio !== undefined) updateData.bio = profileData.bio
        if (profileData.shop_name !== undefined) updateData.shop_name = profileData.shop_name
        if (profileData.city !== undefined) updateData.city = profileData.city
        if (profileData.pincode !== undefined) updateData.pincode = profileData.pincode
        if (profileData.gstin !== undefined) updateData.gstin = profileData.gstin

        // Update the document
        await updateDoc(vendorRef, updateData)

        return { success: true }
    } catch (error) {
        console.error('Error updating vendor profile:', error)
        throw error
    }
}

/**
 * Update profile based on role
 * @param {string} userId - User/Vendor ID
 * @param {string} role - User role ('user' or 'vendor')
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<void>}
 */
export const updateProfile = async (userId, role, profileData) => {
    try {
        if (role === 'vendor') {
            return await updateVendorProfile(userId, profileData)
        } else {
            return await updateUserProfile(userId, profileData)
        }
    } catch (error) {
        console.error('Error updating profile:', error)
        throw error
    }
}
