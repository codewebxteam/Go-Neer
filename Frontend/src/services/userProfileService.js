import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../config/firebase"

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
