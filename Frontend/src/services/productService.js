import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../config/firebase"

export const getProductsByVendor = async (vendorId) => {
  const q = query(
    collection(db, "products"),
    where("vendor_id", "==", vendorId)
  )

  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
