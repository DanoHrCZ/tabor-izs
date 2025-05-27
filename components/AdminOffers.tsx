"use client";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase'; // Adjust the path as necessary
import Link from 'next/link';

interface Offer {
  id: string;
  birthNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string;
  variableSymbol: string;
  payments?: Array<{date: string, amount: number}>;
}

const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchOffers = async () => {
      const q = query(collection(db, 'offers'));
      const querySnapshot = await getDocs(q);
      const offersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Offer[];
      offersData.sort((a, b) => a.variableSymbol.localeCompare(b.variableSymbol));
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

  const filteredOffers = offers.filter((offer) => {
    const query = searchQuery.toLowerCase();
    return (
      offer.firstName?.toLowerCase().includes(query) ||
      offer.lastName?.toLowerCase().includes(query) ||
      offer.variableSymbol?.toLowerCase().includes(query) ||
      offer.birthDate?.toLowerCase().includes(query) ||
      offer.status?.toLowerCase().includes(query)
    );
  });

  const handleSelectAll = () => {
    if (selectedOffers.length === filteredOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(filteredOffers.map((offer) => offer.id));
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

  const addPaymentToOffers = async (amount: number) => {
    if (window.confirm('Opravdu chcete přidat platbu k vybraným položkám?')) {
      const today = new Date().toLocaleDateString("cs-CZ");
      
      const updatePromises = selectedOffers.map((offerId) => {
        const offer = offers.find(o => o.id === offerId);
        const payments = offer?.payments || [];
        const newPayments = [...payments, { date: today, amount }];
        
        // Calculate total paid amount
        const totalPaid = newPayments.reduce((sum, payment) => sum + payment.amount, 0);
        
        const offerRef = doc(db, 'offers', offerId);
        return updateDoc(offerRef, { 
          payments: newPayments,
          status: `uhrazeno celkem ${totalPaid} Kč`
        }).then(() => {
          setOffers((prevOffers) =>
            prevOffers.map((offer) =>
              offer.id === offerId ? { 
                ...offer, 
                payments: newPayments, 
                status: `uhrazeno celkem ${totalPaid} Kč` 
              } : offer
            )
          );
        });
      });
      
      await Promise.all(updatePromises);
      setSelectedOffers([]);
    }
  };

  return (
    <div className="px-4 mt-16 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-text-black">Přihlášky</h1>
        </div>
        <div className="sm:flex sm:items-center sm:ml-4">
            <select
            onChange={(e) => {
              if (e.target.value === "custom") {
                const amountStr = prompt("Zadejte částku:");
                if (amountStr && !isNaN(parseInt(amountStr, 10))) {
                  const amount = parseInt(amountStr, 10);
                  addPaymentToOffers(amount);
                }
              } else {
                handleBulkStatusChange(e.target.value);
              }
            }}
            value=""
            className="mr-2 p-2 border border-gray-300 rounded"
            >
            <option value="" disabled hidden>
              Změnit stav vybraných přihlášek
            </option>
            <option value="neuhrazeno">změnit na &quot;neuhrazeno&quot;</option>
            <option value="uhrazena záloha">změnit na &quot;uhrazena záloha&quot;</option>
            <option value="uhrazeno">Změnit na &quot;uhrazeno&quot;</option>
            <option value="custom">Uhrazena částka (vlastní)</option>
            </select>
          <button
            onClick={handleBulkDelete}
            className="mr-2 p-2 bg-negative-color text-background rounded"
          >
            Smazat vybrané
          </button>
        </div>
      </div>
      
      <div className="mt-4 mb-2">
        <input
          type="text"
          placeholder="Vyhledat přihlášku..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div className="mt-2 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">
                      <input
                        type="checkbox"
                        checked={selectedOffers.length === filteredOffers.length && filteredOffers.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-0">Jméno</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-text-indigo-500">Variabilní symbol (rodné č.)</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-orange-500">Datum narození</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-text-black">Stav</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Akce</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((offer) => (
                    <tr key={offer.id}>
                      <td className="backgroundspace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text-black sm:pl-0">
                        <input
                          type="checkbox"
                          checked={selectedOffers.includes(offer.id)}
                          onChange={() => handleSelectOffer(offer.id)}
                        />
                      </td>
                      <td className="backgroundspace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text-black sm:pl-0">
                        {offer.firstName} {offer.lastName}
                      </td>
                      <td className="backgroundspace-nowrap px-3 py-4 text-sm text-black">{offer.variableSymbol}</td>
                      <td className="backgroundspace-nowrap px-3 py-4 text-sm text-black">{offer.birthDate}</td>
                      <td className="backgroundspace-nowrap px-3 py-4 text-sm text-black">
                        {offer.status}
                        {offer.payments && offer.payments.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            Historie plateb: {offer.payments.map(p => `${p.date}: ${p.amount} Kč`).join(", ")}
                          </div>
                        )}
                      </td>
                      <td className="relative backgroundspace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link href={`/offer/${offer.id}`} className="text-text-indigo hover:text-text-indigo-900 ml-2">Více</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOffers;
