"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Using Next.js router and params
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../Firebase"; // Ensure this path is correct
import React from "react";

interface OfferData {
  firstName: string;
  lastName: string;
  street: string;
  birthDate: string;
  postalCode: string;
  status: string;
  variableSymbol: string;
  userId: string;
  healthIssues: string;
  medications: string;
  additionalInfo: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function UserPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offer, setOffer] = useState<OfferData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const { id } = useParams() as { id: string };
  const router = useRouter();

  useEffect(() => {
    const fetchOffer = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, "offers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const offerData = docSnap.data() as OfferData;
          setOffer(offerData);

          // Fetch user data using userid
          const userDocRef = doc(db, "users", offerData.userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUser(userDocSnap.data() as UserData);
          } else {
            setError("Uživatel nenalezen.");
          }
        } else {
          setError("Nabídka nenalezena.");
        }
      } catch (err) {
        setError("Chyba při načítání dat.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  if (loading) return <p>Načítání...</p>;
  if (error) return <p>Chyba: {error}</p>;

  return (
    <>
      {offer ? (
        <div className="flex flex-col space-y-2 m-4">
          <p className="mt-6 text-xl/8 text-gray-700">
            Informace o dítěti
          </p>
          <span><span className="font-bold text-text-indigo">Jméno: </span> {offer.firstName} {offer.lastName}</span>
          <span><span className="font-bold text-text-indigo">Adresa: </span> {offer.street}, {offer.postalCode}</span>
          <span><span className="font-bold text-text-indigo">Narození: </span> {offer.birthDate}</span>
          <span><span className="font-bold text-text-indigo">Status: </span> {offer.status}</span>
          <span><span className="font-bold text-text-indigo">Variabilní symbol: </span> {offer.variableSymbol}</span>
          <p className="max-w-96"><span className="font-bold text-text-indigo">Zdravotní Problémy: </span> {offer.healthIssues}</p>
          <p className="max-w-96"><span className="font-bold text-text-indigo">Léky: </span> {offer.medications}</p>
          <p className="max-w-96"><span className="font-bold text-text-indigo">Další informace: </span> {offer.additionalInfo}</p>
        </div>
      ) : (
        <p>Data nenalezena.</p>
      )}
      {user && offer && (
        <div className="flex flex-col space-y-2 m-4">
          <p className="mt-6 text-xl/8 text-gray-700">
            Informace o rodiči
          </p>
          <span><span className="font-bold text-text-indigo">Jméno: </span> {user.firstName} {user.lastName}</span>
          <span><span className="font-bold text-text-indigo">Email: </span> {user.email}</span>
          <span><span className="font-bold text-text-indigo">Telefon: </span> {user.phone}</span>
          <button
            className="text-text-indigo font-medium text-left"
            onClick={() => router.push(`/parent/${offer.userId}`)}
          >
            Zobrazit rodiče
          </button>
        </div>
      )}
    </>
  );
}
