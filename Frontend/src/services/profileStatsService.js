import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore"
import { db } from "../config/firebase"

/**
 * Get user profile statistics
 * @param {string} userId - User ID
 * @returns {Object} User stats including total orders, money spent, etc.
 */
export const getUserStats = async (userId) => {
    try {
        // Fetch all orders for this user
        const ordersQuery = query(
            collection(db, "orders"),
            where("user_id", "==", userId)
        )
        const ordersSnap = await getDocs(ordersQuery)
        const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }))

        // Calculate stats
        const totalOrders = orders.length
        const moneySpent = orders.reduce((sum, order) => {
            const total = order.total || order.amount || 0
            return sum + total
        }, 0)

        // Get recent orders (last 5)
        const recentOrders = orders
            .sort((a, b) => {
                const dateA = new Date(a.created_at || a.date || 0)
                const dateB = new Date(b.created_at || b.date || 0)
                return dateB - dateA
            })
            .slice(0, 5)

        return {
            totalOrders,
            moneySpent,
            recentOrders,
            memberStatus: 'active'
        }
    } catch (error) {
        console.error("Error fetching user stats:", error)
        throw error
    }
}

/**
 * Get vendor profile statistics
 * @param {string} vendorId - Vendor ID
 * @returns {Object} Vendor stats including total orders, revenue, rating, etc.
 */
export const getVendorStats = async (vendorId) => {
    try {
        // Fetch all orders for this vendor
        const ordersQuery = query(
            collection(db, "orders"),
            where("vendor_id", "==", vendorId)
        )
        const ordersSnap = await getDocs(ordersQuery)
        const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }))

        // Calculate revenue
        const revenue = orders.reduce((sum, order) => {
            const total = order.total || order.amount || 0
            return sum + total
        }, 0)

        // Get vendor document for rating and other info
        const vendorDoc = await getDoc(doc(db, "vendors", vendorId))
        const vendorData = vendorDoc.exists() ? vendorDoc.data() : {}

        // Get active products count
        const productsQuery = query(
            collection(db, "products"),
            where("vendor_id", "==", vendorId),
            where("is_active", "==", true)
        )
        const productsSnap = await getDocs(productsQuery)
        const activeProducts = productsSnap.size

        return {
            totalOrders: orders.length,
            revenue,
            rating: vendorData.rating || 0,
            activeProducts
        }
    } catch (error) {
        console.error("Error fetching vendor stats:", error)
        throw error
    }
}

/**
 * Get formatted recent orders for display
 * @param {string} userId - User ID
 * @param {number} limit - Number of orders to fetch
 * @returns {Array} Formatted orders array
 */
export const getRecentOrders = async (userId, limit = 5) => {
    try {
        const ordersQuery = query(
            collection(db, "orders"),
            where("user_id", "==", userId)
        )
        const ordersSnap = await getDocs(ordersQuery)
        const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }))

        // Get vendor details for each order
        const ordersWithVendor = await Promise.all(
            orders.map(async (order) => {
                let vendorName = order.vendor_name || 'Unknown Vendor'

                // Try to fetch vendor details if vendor_id exists
                if (order.vendor_id) {
                    try {
                        const vendorDoc = await getDoc(doc(db, "vendors", order.vendor_id))
                        if (vendorDoc.exists()) {
                            vendorName = vendorDoc.data().shop_name || vendorDoc.data().full_name || vendorName
                        }
                    } catch (err) {
                        console.warn("Could not fetch vendor details:", err)
                    }
                }

                return {
                    id: order.id,
                    date: order.created_at || order.date || new Date().toISOString(),
                    vendor: vendorName,
                    items: order.items?.length || order.item_count || 1,
                    total: order.total || order.amount || 0,
                    status: order.status || 'pending'
                }
            })
        )

        // Sort by date and limit
        return ordersWithVendor
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit)
    } catch (error) {
        console.error("Error fetching recent orders:", error)
        throw error
    }
}