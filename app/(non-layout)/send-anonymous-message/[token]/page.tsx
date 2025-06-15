"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../Firebase";
import { updateDoc, addDoc, collection, query, where, getDocs, serverTimestamp, Timestamp, doc } from "firebase/firestore";
import React from "react";

interface TokenData {
  id: string;
  offerId: string;
  childName: string;
  used: boolean;
  expiresAt: Timestamp;
}

export default function AnonymousMessagePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [message, setMessage] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  
  const { token } = useParams() as { token: string };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const tokenQuery = query(
          collection(db, "messageTokens"),
          where("token", "==", token)
        );
        const tokenDocs = await getDocs(tokenQuery);
        
        if (tokenDocs.empty) {
          setError("Neplatný nebo expirovaný odkaz.");
          setLoading(false);
          return;
        }

        const tokenDoc = tokenDocs.docs[0];
        const data = tokenDoc.data() as TokenData;
        
        if (data.used) {
          setError("Tento odkaz již byl použit.");
          setLoading(false);
          return;
        }

        if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
          setError("Tento odkaz vypršel.");
          setLoading(false);
          return;
        }

        setTokenData({ ...data, id: tokenDoc.id });
      } catch (error) {
        setError("Chyba při ověřování odkazu.");
        console.error("Error checking token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const sendMessage = async () => {
    if (!message.trim() || !senderName.trim()) {
      setError("Vyplňte všechna pole.");
      return;
    }

    setSending(true);
    try {
      // Odešleme zprávu
      await addDoc(collection(db, "messages"), {
        offerId: tokenData?.offerId,
        childName: tokenData?.childName,
        message: message.trim(),
        senderName: senderName.trim(),
        timestamp: serverTimestamp(),
        isAnonymous: true
      });

      // Označíme token jako použitý
      await updateDoc(doc(db, "messageTokens", tokenData!.id), {
        used: true,
        usedAt: serverTimestamp()
      });

      setSent(true);
    } catch (error) {
      setError("Chyba při odesílání zprávy.");
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-500">Načítání...</p>;
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;
  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-6">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Zpráva odeslána!</h1>
          <p className="text-gray-600">
            Vaše zpráva pro {tokenData?.childName} byla úspěšně odeslána.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Poslat zprávu pro {tokenData?.childName}
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

          <button
            onClick={sendMessage}
            disabled={sending}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {sending ? "Odesílání..." : "Odeslat zprávu"}
          </button>
        </div>
      </div>
    </div>
  );
}