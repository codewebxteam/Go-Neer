import { doc, setDoc, getDoc, collection, getDocs, GeoPoint, serverTimestamp } from "firebase/firestore"
import { db } from "../config/firebase"

export const createVendor = async (uid, vendorData) => {
  await setDoc(doc(db, "vendors", uid), {
    id: uid,
    email: vendorData.email,
    full_name: vendorData.full_name,
    phone: vendorData.phone,
    shop_name: vendorData.shop_name,
    address: vendorData.address,
    city: vendorData.city,
    pincode: vendorData.pincode,
    gstin: vendorData.gstin,
    location: new GeoPoint(vendorData.latitude, vendorData.longitude),
    role: "vendor",
    rating: 0.5,
    is_active: true,
    is_verified: false,
    image_url: vendorData.image_url || null,
    created_at: serverTimestamp(),
  })
}

export const getVendorById = async (uid) => {
  const snap = await getDoc(doc(db, "vendors", uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const getVendors = async () => {
  const snap = await getDocs(collection(db, "vendors"))
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}
