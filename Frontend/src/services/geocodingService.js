// For converting address to lat-long using OpenStreetMap Nominatim API

export const geocodeAddress = async ({ street, city, pincode }) => {
  // Filter out empty values to avoid malformed queries like ", Bhopal, 462022, India"
  const addressParts = [street, city, pincode, "India"].filter(
    (part) => part && part.trim() !== ""
  )
  const query = encodeURIComponent(addressParts.join(", "))
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "GoNeer/1.0 (contact@goneer.com)", // Required by Nominatim
    },
  })

  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status}`)
  }

  const data = await res.json()

  if (!data || data.length === 0) {
    throw new Error("Unable to determine location from address")
  }

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  }
}
