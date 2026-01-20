import { useEffect, useState } from 'react'
import { getDocuments } from '../services/firestoreService'
import { Loader2 } from 'lucide-react'

/**
 * Example component showing how to fetch and display data from Firestore
 * This demonstrates the integration of Firebase Firestore in your app
 */
export default function FirestoreExample() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)
        const vendorsList = await getDocuments('vendors')
        setVendors(vendorsList)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching vendors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        <p className="font-bold">Error loading vendors:</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Vendors from Firestore</h2>
      {vendors.length === 0 ? (
        <p className="text-slate-500">No vendors found in database</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-lg transition-all">
              {vendor.image && (
                <img
                  src={vendor.image}
                  alt={vendor.storeName}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="font-bold text-lg">{vendor.storeName}</h3>
              <p className="text-sm text-slate-600">{vendor.description}</p>
              {vendor.rating && (
                <p className="text-sm text-yellow-600 font-semibold mt-2">⭐ {vendor.rating}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
