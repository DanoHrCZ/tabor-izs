"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../Firebase";
import React from "react";

interface ParentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface ChildData {
  id: string;
  firstName: string;
  lastName: string;
}

export default function ParentPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [parent, setParent] = useState<ParentData | null>(null);
  const [children, setChildren] = useState<ChildData[]>([]);
  const { id } = useParams() as { id: string };
  const router = useRouter();

  useEffect(() => {
    const fetchParentAndChildren = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const parentData = docSnap.data() as ParentData;
          setParent(parentData);

          const childrenQuery = query(
            collection(db, "offers"),
            where("userId", "==", id)
          );
          const childrenSnap = await getDocs(childrenQuery);
          const childrenData = childrenSnap.docs.map((childDoc) => ({
            id: childDoc.id,
            ...childDoc.data(),
          })) as ChildData[];
          setChildren(childrenData);
        } else {
          setError("Rodič nenalezen.");
        }
      } catch (err) {
        setError("Chyba při načítání dat.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParentAndChildren();
  }, [id]);

  if (loading) return <p>Načítání...</p>;
  if (error) return <p>Chyba: {error}</p>;

  return (
    <>
      {parent ? (
        <div className="flex flex-col space-y-2 m-4">
          <p className="mt-6 text-xl/8 text-gray-700">Informace o rodiči</p>
          <span><span className="font-bold text-text-indigo">Jméno: </span> {parent.firstName} {parent.lastName}</span>
          <span><span className="font-bold text-text-indigo">Email: </span> {parent.email}</span>
          <span><span className="font-bold text-text-indigo">Telefon: </span> {parent.phone}</span>

          <p className="mt-6 text-lg text-gray-700">Děti:</p>
          {children.length > 0 ? (
            <ul>
              {children.map((child) => (
                <li key={child.id}>
                  <button
                    className="text-text-indigo font-medium"
                    onClick={() => router.push(`/offer/${child.id}`)}
                  >
                    {child.firstName} {child.lastName}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Žádné děti nenalezeny.</p>
          )}
        </div>
      ) : (
        <p>Data nenalezena.</p>
      )}
    </>
  );
}
