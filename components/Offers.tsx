// components/UserTable.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase"; // Adjust the path as necessary
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import getAuth and onAuthStateChanged from Firebase
import Link from "next/link";

interface Offer {
  id: string;
  birthNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string;
  variableSymbol: string;
}

const UserTable: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]); // State to hold offers data

  // Fetch offers from Firestore for the logged-in user
  const fetchOffers = async (currentUserId: string) => {
    const offersCollection = collection(db, "offers");
    const userOffersQuery = query(
      offersCollection,
      where("userId", "==", currentUserId)
    );
    const offerDocs = await getDocs(userOffersQuery);
    const offersData = offerDocs.docs.map((doc) => {
      const offer = doc.data() as Offer;
      return {
        ...offer,
        id: doc.id,
        status: offer.status,
      };
    });
    setOffers(offersData);
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchOffers(user.uid); // Fetch offers when user is authenticated
      }
    });
  }, []); // Fetch offers on component mount

  return (
    <div className="px-4 mt-16 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-text-black">
            Přihlášky
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href="/new-offer">
            <button
              type="button"
              className="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-background shadow-sm hover:bg-text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Nová Přihláška
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-2 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">
                    Jméno
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-text-indigo-500">
                    Variabilní symbol
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-orange-500">
                    Datum narození
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-text-black">
                    Stav
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Více</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="backgroundspace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text-black sm:pl-0">
                      {offer.firstName} {offer.lastName}
                    </td>
                    <td className="backgroundspace-nowrap px-3 py-4 text-sm text-black">
                      {offer.variableSymbol}
                    </td>
                    <td className="backgroundspace-nowrap px-3 py-4 text-sm text-black">
                      {offer.birthDate}
                    </td>
                    <td className="backgroundspace-nowrap px-3 py-4 text-sm text-black">
                      {offer.status}
                    </td>
                    <td className="relative backgroundspace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link
                        href={`/offer/${offer.id}`}
                        className="text-text-indigo hover:text-text-indigo-900 ml-2"
                      >
                        Více
                        <span className="sr-only">
                          , {offer.firstName} {offer.lastName}
                        </span>
                      </Link>
                      <Link
                        href={`/message/${offer.id}`}
                        className="text-text-indigo hover:text-text-indigo-900 ml-4"
                      >
                        Poslat zprávu
                        <span className="sr-only">
                          , {offer.firstName} {offer.lastName}
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
