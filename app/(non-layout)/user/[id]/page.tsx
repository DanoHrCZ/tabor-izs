"use client"; // Necessary for Next.js 13 with App Router

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Using Next.js router and params
import { auth, db } from "../../../../Firebase"; // Ensure this path is correct
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import Offers from "../../../../components/Offers"; // Ensure this path is correct
import React from "react";

interface UserData {
  firstName: string;
  phone: string;
  email: string;
}

export default function UserPage() {
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [userData, setUserData] = useState<UserData | null>(null); // State for Firestore data
  const router = useRouter();
  const { id } = useParams() as { id: string }; // Get user ID from URL parameters

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if the authenticated user's ID matches the one from the URL
        if (currentUser.uid === id) {
          try {
            // Fetch user data from Firestore using the user ID
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              setUserData(userDocSnap.data() as UserData); // Set Firestore data
            } else {
              setError("Uživatel nebyl nalezen.");
            }
          } catch (error) {
            setError("Chyba při načítání dat.");
            console.error("Error fetching user data:", error);
          }
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
        <h1 className="text-3xl font-bold text-center text-text-black">
          Vítej, {userData?.firstName}!
        </h1>
        {userData && (
          <div className="mt-4 text-center">
            <p>Telefon: {userData.phone}</p>
            <p>Email: {userData.email}</p>
          </div>
        )}
      </div>
      <div className="text-center">
        <p>Po vytvoření přihlášky uhraďte zálohu ve výši <b>4000 Kč</b> nejpozději do 3 dnů na účet 2300799562/2010. Nezapomeňte vyplnit <b>VARIABILNÍ SYMBOL</b> přihlášky!</p>
        <p>Platby kontrolujeme ručně, proto může trvat nějakou dobu, než vaši platbu zaregistrujeme. V případě nejasností nebo komplikací nás kontaktujte prostřednictvím emailu. (taborizs@gmail.com))</p>
        <p>Následně je potřeba uhradit doplatek ve výši <b>5000 Kč</b> do 15.5.</p>
      </div>
      <Offers />
    </div>
  );
}