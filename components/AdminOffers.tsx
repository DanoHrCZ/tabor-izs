import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase'; // Adjust the path as necessary
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import getAuth and onAuthStateChanged from Firebase
import Link from 'next/link';

interface Offer {
  id: string;
  birthNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string;
}

const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      const q = query(collection(db, 'offers'));
      const querySnapshot = await getDocs(q);
      const offersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Offer[];
      setOffers(offersData);
    };

    fetchOffers();
  }, []);

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffers((prevSelected) =>
      prevSelected.includes(offerId)
        ? prevSelected.filter((id) => id !== offerId)
        : [...prevSelected, offerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOffers.length === offers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(offers.map((offer) => offer.id));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm('Opravdu chcete smazat vybrané položky?')) {
      const deletePromises = selectedOffers.map((offerId) =>
        deleteOffer(offerId)
      );
      await Promise.all(deletePromises);
      setSelectedOffers([]);
    }
  };

  const updateStatus = async (offerId: string, newStatus: string) => {
    const offerRef = doc(db, 'offers', offerId);
    await updateDoc(offerRef, { status: newStatus });
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === offerId ? { ...offer, status: newStatus } : offer
      )
    );
  };

  const deleteOffer = async (offerId: string) => {
    const offerRef = doc(db, 'offers', offerId);
    await deleteDoc(offerRef);
    setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== offerId));
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (newStatus === "") return;
    if (window.confirm('Opravdu chcete změnit stav vybraných položek?')) {
      const updatePromises = selectedOffers.map((offerId) =>
        updateStatus(offerId, newStatus)
      );
      await Promise.all(updatePromises);
      setSelectedOffers([]);
    }
  };

  return (
    <div className="px-4 mt-16 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Přihlášky</h1>
        </div>
        <div className="sm:flex sm:items-center sm:ml-4">
          <select
            onChange={(e) => handleBulkStatusChange(e.target.value)}
            className="mr-2 p-2 border border-gray-300 rounded"
          >
            <option value="neuhrazeno">Neuhrazeno</option>
            <option value="uhrazena záloha">Uhrazena záloha</option>
            <option value="uhrazeno">Uhrazeno</option>
          </select>
          <button
            onClick={handleBulkDelete}
            className="mr-2 p-2 bg-red-600 text-white rounded"
          >
            Smazat vybrané
          </button>
        </div>
      </div>
      <div className="mt-2 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">
                    <input
                      type="checkbox"
                      checked={selectedOffers.length === offers.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">Jméno</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-blue-500">Variabilní symbol (rodné č.)</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-orange-500">Datum narození</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stav</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Akce</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      <input
                        type="checkbox"
                        checked={selectedOffers.includes(offer.id)}
                        onChange={() => handleSelectOffer(offer.id)}
                      />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {offer.firstName} {offer.lastName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{offer.birthNumber}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{offer.birthDate}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{offer.status}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link href={`/offer/edit/${offer.id}`} className="text-blue-600 hover:text-blue-900 ml-2">Upravit</Link>
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

export default AdminOffers;
