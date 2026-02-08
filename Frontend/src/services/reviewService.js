import { db } from "../config/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";

const REVIEWS_COLLECTION = "reviews";

/**
 * Get all reviews from Firestore
 * @returns {Promise<Array>} Array of review objects
 */
export const getReviews = async () => {
    try {
        const reviewsRef = collection(db, REVIEWS_COLLECTION);
        const q = query(reviewsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return reviews;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Failed to fetch reviews");
    }
};

/**
 * Add a new review to Firestore
 * @param {Object} reviewData - The review data
 * @param {string} reviewData.userName - Name of the reviewer
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} reviewData.comment - Review comment
 * @param {string} [reviewData.userId] - Optional user ID if logged in
 * @returns {Promise<Object>} The created review document
 */
export const addReview = async (reviewData) => {
    try {
        const { userName, rating, comment, userId } = reviewData;

        // Validate required fields
        if (!userName || !rating || !comment) {
            throw new Error("userName, rating, and comment are required");
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        const reviewDoc = {
            userName: userName.trim(),
            rating: Number(rating),
            comment: comment.trim(),
            createdAt: serverTimestamp(),
            ...(userId && { userId }),
        };

        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), reviewDoc);

        return {
            id: docRef.id,
            ...reviewDoc,
            createdAt: new Date(), // Use current date for immediate display
        };
    } catch (error) {
        console.error("Error adding review:", error);
        throw new Error(error.message || "Failed to add review");
    }
};
