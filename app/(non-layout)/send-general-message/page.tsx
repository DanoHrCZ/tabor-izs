"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../Firebase";

export default function SendGeneralMessagePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [childName, setChildName] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const sendMessage = async () => {
    if (!message.trim() || !senderName.trim() || !childName.trim()) {
      setError("Vyplňte všechna pole.");
      return;
    }

    setSending(true);
    setError(null);
    
    try {
      await addDoc(collection(db, "messages"), {
        childName: childName.trim(),
        message: message.trim(),
        senderName: senderName.trim(),
        timestamp: serverTimestamp(),
        isGeneral: true,
        offerId: null // Obecné zprávy nemají přiřazené konkrétní offerId
      });

      setMessage("");
      setSenderName("");
      setChildName("");
      setSent(true);
    } catch (error) {
      setError("Chyba při odesílání zprávy.");
      console.error("Error sending general message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-500">Načítání...</p>;
  
  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-6">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Zpráva odeslána!</h1>
          <p className="text-gray-600 mb-6">
            Vaše zpráva pro {childName} byla úspěšně odeslána.
          </p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => {
                setSent(false);
                setChildName("");
                setMessage("");
                setSenderName("");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Poslat další zprávu
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Zpět na hlavní stránku
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-6">
      {/* Navigační tlačítka */}
      <div className="w-full max-w-2xl mb-4 flex gap-2">
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

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Poslat obecnou zprávu
        </h1>
        
        <p className="text-gray-600 mb-6 text-center">
          Napište zprávu jakémukoli dítěti na táboře. Stačí zadat jméno dítěte a zpráva bude předána.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
              Jméno dítěte *
            </label>
            <input
              type="text"
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              placeholder="Zadejte jméno dítěte"
            />
          </div>

          <div>
            <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">
              Vaše jméno *
            </label>
            <input
              type="text"
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              placeholder="Zadejte vaše jméno"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Zpráva *
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              placeholder="Napište zprávu pro dítě..."
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={sending}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 font-medium"
          >
            {sending ? "Odesílání..." : "Odeslat zprávu"}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Informace o obecných zprávách:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Zprávy mohou posílat všichni registrovaní uživatelé</li>
            <li>• Zprávy budou vytištěny a předány dětem na táboře</li>
            <li>• Všechny zprávy jsou moderovány vedením tábora</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
