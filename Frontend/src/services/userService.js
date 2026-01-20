import { addDocument } from './firestoreService'

/**
 * Create a vendor profile in Firestore
 * @param {string} userId - The user's ID from Firebase Auth
 * @param {object} vendorData - Vendor-specific data
 */
export const createVendorProfile = async (userId, vendorData) => {
  try {
    const vendorProfile = {
      userId,
      storeName: vendorData.storeName || vendorData.displayName,
      description: vendorData.description || '',
      location: vendorData.location || null,
      rating: 0,
      totalOrders: 0,
      image: vendorData.image || null,
      createdAt: new Date(),
      ...vendorData,
    }
    
    return await addDocument('vendors', vendorProfile)
  } catch (error) {
    console.error('Error creating vendor profile:', error)
    throw error
  }
}

/**
 * Create a customer profile in Firestore
 * @param {string} userId - The user's ID from Firebase Auth
 * @param {object} customerData - Customer-specific data
 */
export const createCustomerProfile = async (userId, customerData) => {
  try {
    const customerProfile = {
      userId,
      phone: customerData.phone || '',
      address: customerData.address || '',
      createdAt: new Date(),
      ...customerData,
    }
    
    return await addDocument('customers', customerProfile)
  } catch (error) {
    console.error('Error creating customer profile:', error)
    throw error
  }
}

/**
 * Get user statistics (orders, favorites, etc.)
 * @param {string} userId - The user's ID
 */
export const getUserStats = async (userId) => {
  try {
    // This is a placeholder - implement based on your needs
    return {
      totalOrders: 0,
      totalSpent: 0,
      favorites: 0,
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    throw error
  }
}
