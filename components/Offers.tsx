// components/UserTable.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase'; // Adjust the path as necessary
import Link from 'next/link'; // Import Link from Next.js

interface Offer {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string; // Assuming you have a status field in your offer data
  // Add other fields as necessary
}

const UserTable: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]); // State to hold offers data

  // Fetch offers from Firestore
  const fetchOffers = async () => {
    const offersCollection = collection(db, 'offers'); // Adjust 'offers' to your collection name
    const offerDocs = await getDocs(offersCollection);
    const offersData = offerDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Offer[];
    setOffers(offersData);
  };

  useEffect(() => {
    fetchOffers();
  }, []); // Fetch offers on component mount

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Přihlášky</h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href="/new-offer">
            <button
              type="button"
              className="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Nová Přihláška
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">Jméno</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-blue-500">ID Přihlášky</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-orange-500">Datum narození</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stav</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Více</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {offer.firstName} {offer.lastName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{offer.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{offer.birthDate}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{offer.status}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link href={`/offer/${offer.id}`} className="text-black hover:text-white">
                        Více<span className="sr-only">, {offer.firstName} {offer.lastName}</span>
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
