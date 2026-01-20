import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange } from '../services/authService'
import { getDocument, updateDocument } from '../services/firestoreService'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Set a timeout to stop loading after 10 seconds
        const loadingTimeout = setTimeout(() => {
            setLoading(false)
        }, 10000)

        // Listen to Firebase auth state changes
        const unsubscribe = onAuthChange(async (currentUser) => {
            try {
                if (currentUser) {
                    setUser(currentUser)
                    // Fetch user profile from Firestore
                    const userProfile = await getDocument('users', currentUser.uid)
                    setProfile(userProfile || null)
                } else {
                    setUser(null)
                    setProfile(null)
                }
            } catch (error) {
                console.error("Error fetching user profile:", error)
            } finally {
                setLoading(false)
                clearTimeout(loadingTimeout)
            }
        })

        return () => {
            unsubscribe()
            clearTimeout(loadingTimeout)
        }
    }, [])

    const login = async (email, password) => {
        try {
            const { signIn } = await import('../services/authService')
            const result = await signIn(email, password)
            
            // Fetch user profile
            const userProfile = await getDocument('users', result.user.uid)
            console.log('Login context - user profile:', userProfile)
            
            return { user: result.user, error: null, profile: userProfile }
        } catch (error) {
            console.error('Login context error:', error)
            return { user: null, error, profile: null }
        }
    }

    const signup = async (email, password, fullName, role) => {
        try {
            const { signUp } = await import('../services/authService')
            const { setDoc, doc } = await import('firebase/firestore')
            const { db } = await import('../config/firebase')
            
            const result = await signUp(email, password)
            
            // Create user profile in Firestore with uid as document ID
            const newProfile = {
                email,
                displayName: fullName,
                role,
                createdAt: new Date(),
                photoURL: null,
                uid: result.user.uid
            }
            
            // Use setDoc to create document with custom ID (uid)
            await setDoc(doc(db, 'users', result.user.uid), newProfile)
            console.log('Signup context - user profile created:', newProfile)
            
            return { user: result.user, error: null, profile: newProfile }
        } catch (error) {
            console.error('Signup context error:', error)
            return { user: null, error: error, profile: null }
        }
    }

    const signOut = async () => {
        setLoading(true)
        try {
            const { signOut: firebaseSignOut } = await import('../services/authService')
            await firebaseSignOut()
        } catch (error) {
            console.error("Sign out error:", error)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (data) => {
        try {
            if (user) {
                await updateDocument('users', user.uid, data)
                setProfile(prev => ({ ...prev, ...data }))
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            throw error
        }
    }

    const value = {
        user,
        profile,
        loading,
        login,
        signup,
        signOut,
        updateProfile,
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
