"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, db } from "../../../../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import React from "react";

interface Offer {
  id: string;
  firstName: string;
  lastName: string;
  userId: string;
}

export default function MessagePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [message, setMessage] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [oneTimeLink, setOneTimeLink] = useState<string>("");
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  
  const router = useRouter();
  const { offerId } = useParams() as { offerId: string };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const offerDoc = await getDoc(doc(db, "offers", offerId));
          if (offerDoc.exists()) {
            const offerData = offerDoc.data() as Offer;
            if (offerData.userId === currentUser.uid) {
              setOffer({ ...offerData, id: offerDoc.id });
            } else {
              setError("Nemáte oprávnění k odeslání zprávy tomuto dítěti.");
            }
          } else {
            setError("Přihláška nebyla nalezena.");
          }
        } catch (error) {
          setError("Chyba při načítání přihlášky.");
          console.error("Error fetching offer:", error);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [offerId, router]);

  const generateOneTimeLink = async () => {
    const token = uuidv4();
    const link = `${window.location.origin}/send-anonymous-message/${token}`;
    
    try {
      // Uložíme token do databáze s informacemi o přihlášce
      await addDoc(collection(db, "messageTokens"), {
        token,
        offerId,
        childName: `${offer?.firstName} ${offer?.lastName}`,
        used: false,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hodin
      });
      
      setOneTimeLink(link);
      setShowLinkModal(true);
    } catch (error) {
      setError("Chyba při generování odkazu.");
      console.error("Error generating one-time link:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !senderName.trim()) {
      setError("Vyplňte všechna pole.");
      return;
    }

    setSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        offerId,
        childName: `${offer?.firstName} ${offer?.lastName}`,
        message: message.trim(),
        senderName: senderName.trim(),
        timestamp: serverTimestamp(),
        isAnonymous: false
      });

      setMessage("");
      setSenderName("");
      alert("Zpráva byla úspěšně odeslána!");
    } catch (error) {
      setError("Chyba při odesílání zprávy.");
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(oneTimeLink);
    alert("Odkaz byl zkopírován do schránky!");
  };

  if (loading) return <p className="text-center text-lg text-gray-500">Načítání...</p>;
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Poslat zprávu pro {offer?.firstName} {offer?.lastName}
        </h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">
              Vaše jméno
            </label>
            <input
              type="text"
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
              placeholder="Zadejte vaše jméno"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Zpráva
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
              placeholder="Napište zprávu pro dítě..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={sendMessage}
              disabled={sending}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {sending ? "Odesílání..." : "Odeslat zprávu"}
            </button>
            
            <button
              onClick={generateOneTimeLink}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Vytvořit jednorázový odkaz
            </button>
          </div>
        </div>
      </div>

      {/* Modal pro jednorázový odkaz */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Jednorázový odkaz</h2>
            <p className="mb-4 text-gray-600">
              Tento odkaz můžete poslat komukoli, kdo chce poslat zprávu vašemu dítěti. 
              Odkaz funguje pouze jednou a vyprší za 24 hodin.
            </p>
            <div className="bg-gray-100 p-3 rounded mb-4 break-all text-sm">
              {oneTimeLink}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Zkopírovat
              </button>
              <button
                onClick={() => setShowLinkModal(false)}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}