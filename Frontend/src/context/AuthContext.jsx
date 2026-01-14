import { createContext, useContext, useEffect, useState } from 'react'
import { MOCK_USERS, MOCK_PROFILES } from '../data/mockData'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate checking for a persisted session (e.g., from localStorage)
        const storedUser = localStorage.getItem('mock_user')
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setUser(parsedUser)
                // Find matching profile
                const foundProfile = MOCK_PROFILES.find(p => p.id === parsedUser.id)
                setProfile(foundProfile || null)
            } catch (e) {
                console.error("Failed to parse stored user", e)
                localStorage.removeItem('mock_user')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        setLoading(true)
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))

        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password)

        if (foundUser) {
            setUser(foundUser)
            localStorage.setItem('mock_user', JSON.stringify(foundUser))

            const foundProfile = MOCK_PROFILES.find(p => p.id === foundUser.id)
            setProfile(foundProfile)

            setLoading(false)
            return { user: foundUser, error: null }
        } else {
            setLoading(false)
            return { user: null, error: { message: 'Invalid credentials' } }
        }
    }

    const signup = async (email, password, fullName, role) => {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 800))

        // Check if user already exists
        if (MOCK_USERS.some(u => u.email === email)) {
            setLoading(false)
            return { user: null, error: { message: 'User already exists' } }
        }

        const newUser = {
            id: `user-${Date.now()}`,
            email,
            password,
            user_metadata: { full_name: fullName },
            role
        }

        const newProfile = {
            id: newUser.id,
            full_name: fullName,
            role: role
        }

        // Add to mock data (in-memory only for now, resets on reload unless we persist MOCK_USERS too, but this is fine for demo)
        MOCK_USERS.push(newUser)
        MOCK_PROFILES.push(newProfile)

        // Auto login
        setUser(newUser)
        setProfile(newProfile)
        localStorage.setItem('mock_user', JSON.stringify(newUser))

        setLoading(false)
        return { user: newUser, error: null }
    }

    const signOut = async () => {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        setUser(null)
        setProfile(null)
        localStorage.removeItem('mock_user')
        setLoading(false)
    }

    const value = {
        user,
        profile,
        loading,
        login,
        signup,
        signOut,
    }

    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-400 text-sm">Loading Mock Experience...</p>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
