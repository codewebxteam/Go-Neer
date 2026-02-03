import { collection, getDocs, query, where, addDoc, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../config/firebase"

export const getProductsByVendor = async (vendorId) => {
  const q = query(
    collection(db, "products"),
    where("vendor_id", "==", vendorId)
  )

  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const createProduct = async (productData) => {
  // Add a new document with a generated id
  const docRef = await addDoc(collection(db, "products"), {
    ...productData,
    created_at: new Date().toISOString()
  })
  return { id: docRef.id, ...productData }
}

export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, "products", productId))
}

export const updateProduct = async (productId, data) => {
  const docRef = doc(db, "products", productId)
  await updateDoc(docRef, {
    ...data,
    updated_at: new Date().toISOString()
  })
  return { id: productId, ...data }
}

export const getAllProducts = async () => {
  const snap = await getDocs(collection(db, "products"))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getProductById = async (productId) => {
  const docRef = doc(db, "products", productId)
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() }
  }
  return null
}
