import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'
import { addDocument, updateDocument, getDocument, deleteDocument } from '../services/firestoreService'

const CartContext = createContext({})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    // Load cart from Firestore when user logs in
    useEffect(() => {
        if (user) {
            loadCartFromFirestore()
        } else {
            // Load from localStorage when not authenticated
            const savedCart = localStorage.getItem('cart')
            if (savedCart) {
                try {
                    setCartItems(JSON.parse(savedCart))
                } catch (e) {
                    console.error('Failed to parse cart from localStorage', e)
                }
            }
        }
    }, [user])

    // Save cart to localStorage when it changes
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        }
    }, [cartItems, user])

    // Load cart from Firestore
    const loadCartFromFirestore = async () => {
        try {
            setLoading(true)
            const cart = await getDocument('carts', user.uid)
            if (cart && cart.items) {
                setCartItems(cart.items)
            } else {
                setCartItems([])
            }
        } catch (error) {
            console.error('Error loading cart:', error)
            setCartItems([])
        } finally {
            setLoading(false)
        }
    }

    // Save cart to Firestore
    const saveCartToFirestore = async (items) => {
        if (!user) return

        try {
            if (items.length === 0) {
                // Delete cart if empty
                try {
                    await deleteDocument('carts', user.uid)
                } catch (e) {
                    console.log('Cart not found, creating new one')
                }
            } else {
                // Save or update cart
                await updateDocument('carts', user.uid, {
                    items,
                    updatedAt: new Date(),
                    userId: user.uid
                }).catch(async () => {
                    // If update fails, try to add
                    await addDocument('carts', {
                        userId: user.uid,
                        items,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                })
            }
        } catch (error) {
            console.error('Error saving cart:', error)
        }
    }

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existing = prevItems.find((item) => item.id === product.id)
            let updatedCart

            if (existing) {
                toast.info(`Increased quantity of ${product.name}`)
                updatedCart = prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                toast.success(`Added ${product.name} to cart`)
                updatedCart = [...prevItems, { ...product, quantity: 1 }]
            }

            if (user) {
                saveCartToFirestore(updatedCart)
            }

            return updatedCart
        })
    }

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.filter((item) => item.id !== productId)
            
            if (user) {
                saveCartToFirestore(updatedCart)
            }

            return updatedCart
        })
        toast.error('Removed from cart')
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId)
            return
        }

        setCartItems((prevItems) => {
            const updatedCart = prevItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )

            if (user) {
                saveCartToFirestore(updatedCart)
            }

            return updatedCart
        })
    }

    const clearCart = () => {
        setCartItems([])
        if (user) {
            saveCartToFirestore([])
        }
    }

    const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        loading,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
