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
  if (loading)
    return <p className="text-center text-lg text-gray-500">Načítání...</p>;

  // Error handling
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  // Render user information and Offers component if authenticated
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-6">
      {/* Navigační tlačítka */}
      <div className="w-full max-w-3xl mb-4 flex gap-2">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          ← Zpět
        </button>
        <button
          onClick={() => router.forward()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          Vpřed →
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Vítej, {userData?.firstName}!
        </h1>
        {userData && (
          <div className="mt-4 text-center">
            <p className="text-lg text-gray-700">Telefon: {userData.phone}</p>
            <p className="text-lg text-gray-700">Email: {userData.email}</p>
          </div>
        )}
      </div>
      <div className="w-full max-w-3xl bg-white p-8 mt-6 rounded-lg shadow-md">
        <p className="text-lg text-gray-700">
          Po vytvoření přihlášky uhraďte zálohu ve výši <b>4000 Kč</b>{" "}
          nejpozději do 3 dnů na účet 2300799562/2010. Nezapomeňte vyplnit{" "}
          <b>VARIABILNÍ SYMBOL</b> přihlášky!
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Platby kontrolujeme ručně, proto může trvat nějakou dobu, než vaši
          platbu zaregistrujeme. V případě nejasností nebo komplikací nás
          kontaktujte prostřednictvím emailu. (taborizs@seznam.cz)
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Následně je potřeba uhradit doplatek ve výši <b>5000 Kč</b> do 15.5.
        </p>
      </div>
      <div className="w-full max-w-3xl bg-white p-8 mt-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900">
          Dokumenty ke stažení
        </h2>
        <ul className="list-none mt-4 space-y-2">
          <li>
            <a
              href="/documents/NÁSTUPNÍ LIST 2025.docx"
              download
              className="text-blue-500 underline"
            >
              Nástupní list
            </a>
          </li>
          <li>
            <a
              href="/documents/prohlášení o bezinfekčnosti.docx"
              download
              className="text-blue-500 underline"
            >
              Prohlášení o bezinfekčnosti
            </a>
          </li>
          <li>
            <a
              href="/documents/Tábor IZS 2025 základní informace.docx"
              download
              className="text-blue-500 underline"
            >
              Tábor IZS 2025 základní informace
            </a>
          </li>
          <li>
            <a
              href="/documents/Seznam věcí na tábor IZS.docx"
              download
              className="text-blue-500 underline"
            >
              Seznam věcí na tábor
            </a>
          </li>
          <li>
            <a
              href="/documents/zdravotni zpusobilost dítěte.pdf"
              download
              className="text-blue-500 underline"
            >
              Posudek o zdravotní způsobilosti dítěte
            </a>
          </li>
        </ul>
      </div>
      <div className="w-full max-w-3xl mt-6">
        <Offers />
      </div>
    </div>
  );
}
