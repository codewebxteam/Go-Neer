import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase/config'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

import { serverTimestamp } from "firebase/firestore";

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                // Fetch user profile/role from Firestore
                try {
                    const docRef = doc(db, "users", currentUser.uid)
                    const docSnap = await getDoc(docRef)

                    if (docSnap.exists()) {
                        setProfile(docSnap.data())
                    } else {
                        // Handle case where auth exists but no profile doc
                        console.warn("No profile found for user:", currentUser.uid)
                        setProfile(null)
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error)
                }
            } else {
                setUser(null)
                setProfile(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const login = async (email, password) => {
        setLoading(true)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const loggedInUser = userCredential.user

            // Fetch profile immediately to ensure state is updated before redirect
            const docRef = doc(db, "users", loggedInUser.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setProfile(docSnap.data())
            }

            setUser(loggedInUser)
            setLoading(false)
            return { user: loggedInUser, error: null }
        } catch (error) {
            setLoading(false)
            let errorMessage = 'Failed to login'
            if (error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password'
            if (error.code === 'auth/user-not-found') errorMessage = 'User not found'
            if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password'

            return { user: null, error: { message: errorMessage, code: error.code } }
        }
    }

    const signup = async (email, password, fullName, role, profileData = {}) => {
        setLoading(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const newUser = userCredential.user

            const newProfile = {
                id: newUser.uid,
                email,
                full_name: fullName,
                role,
                // createdAt: new Date(),
                createdAt: serverTimestamp(),
                ...profileData
            }

            // Create user document in Firestore
            await setDoc(doc(db, "users", newUser.uid), newProfile)

            setUser(newUser)
            setProfile(newProfile)

            setLoading(false)
            return { user: newUser, error: null }
        } catch (error) {
            setLoading(false)
            let errorMessage = 'Failed to signup'
            if (error.code === 'auth/email-already-in-use') errorMessage = 'Email is already registered'
            if (error.code === 'auth/weak-password') errorMessage = 'Password should be at least 6 characters'

            return { user: null, error: { message: errorMessage, code: error.code } }
        }
    }

    const signOut = async () => {
        setLoading(true)
        try {
            await firebaseSignOut(auth)
            setUser(null)
            setProfile(null)
        } catch (error) {
            console.error("Error signing out:", error)
        } finally {
            setLoading(false)
        }
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
                <p className="text-slate-400 text-sm">Loading...</p>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
