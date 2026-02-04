import { collection, getDocs, query, where, orderBy, doc, updateDoc, addDoc } from "firebase/firestore"
import { db } from "../config/firebase"

export const getOrdersByUser = async (uid) => {
  const q = query(
    collection(db, "orders"),
    where("user_id", "==", uid)
  )

  const snap = await getDocs(q)
  const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export const getOrdersByVendor = async (vendorId) => {
  const q = query(
    collection(db, "orders"),
    where("vendor_id", "==", vendorId)
  )
  const snap = await getDocs(q)
  const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  // Sort client-side to avoid compound index requirement
  return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export const updateOrderStatus = async (orderId, status) => {
  const orderRef = doc(db, "orders", orderId)
  await updateDoc(orderRef, { status })
}

export const createOrder = async (orderData) => {
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    created_at: new Date().toISOString() // Ensure server timestamp or ISO string depending on need
  })
  return { id: docRef.id, ...orderData }
}

export const getAllOrders = async () => {
  const snap = await getDocs(query(collection(db, "orders"), orderBy("created_at", "desc")))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
