"use client"; // Necessary for Next.js 13 with App Router

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Using Next.js router and params
import { auth } from "../../../Firebase"; // Ensure this path is correct
import { onAuthStateChanged } from "firebase/auth";
import Offers from "../../../components/Offers"; // Ensure this path is correct

export default function UserPage() {
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [user, setUser] = useState<any | null>(null); // State for user information
  const router = useRouter();
  const { id } = useParams(); // Get user ID from URL parameters

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Check if the authenticated user's ID matches the one from the URL
        if (currentUser.uid === id) {
          setUser(currentUser); // Set user data if ID matches
        } else {
          setError("Nemáte oprávnění k přístupu na tuto stránku."); // Permission error
          router.push("/login"); // Redirect to login if IDs do not match
        }
      } else {
        router.push("/login"); // Redirect to login if no user is authenticated
      }
      setLoading(false); // Set loading to false after checking authentication
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [id, router]);

  // Loading state
  if (loading) return <p>Načítání...</p>;

  // Error handling
  if (error) return <p className="text-red-500">{error}</p>;

  // Render user information and Offers component if authenticated
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Vítejte, {user.email}!
        </h1>
      </div>
      <Offers /> {/* Render Offers component */}
    </div>
  );
}
