import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "../config/firebase"

export const getOrdersByUser = async (uid) => {
  const q = query(
    collection(db, "orders"),
    where("user_id", "==", uid),
    orderBy("created_at", "desc")
  )

  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
