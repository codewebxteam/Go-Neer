import { doc, getDoc } from "firebase/firestore"
import { db } from "../config/firebase"

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
