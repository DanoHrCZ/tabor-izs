"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../Firebase";
import { useRouter } from "next/navigation";

interface Offer {
  id: string;
  birthNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string;
  variableSymbol: string;
  payments?: Array<{ date: string; amount: number }>;
}

const ZdravotnikOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchOffers = async () => {
      const q = query(collection(db, "offers"));
      const querySnapshot = await getDocs(q);
      const offersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Offer[];
      offersData.sort((a, b) =>
        a.variableSymbol.localeCompare(b.variableSymbol)
      );
      setOffers(offersData);
    };

    fetchOffers();
  }, []);

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

  const handleViewDetail = (offerId: string) => {
    router.push(`/offer/${offerId}`);
  };

  // Calculate statistics
  const totalOffers = offers.length;
  const filteredCount = filteredOffers.length;
  const paidCount = offers.filter((offer) => 
    offer.status && (offer.status.includes("uhrazeno") || offer.status.includes("uhrazena záloha"))
  ).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Přihlášky na tábor
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Přehled všech přihlášek s možností zobrazení detailů.
          </p>
        </div>
      </div>

      {/* Vyhledávání */}
      <div className="mt-4 mb-6">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Vyhledat přihlášku..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
        </div>
      </div>

      {/* Statistiky */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {totalOffers}
            </div>
            <div className="text-sm text-gray-600">Celkem přihlášek</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {filteredCount}
            </div>
            <div className="text-sm text-gray-600">Zobrazeno</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {paidCount}
            </div>
            <div className="text-sm text-gray-600">Uhrazeno</div>
          </div>
        </div>
      </div>

      {/* Tabulka přihlášek */}
      <div className="mt-2 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jméno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Var. symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Datum nar.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stav
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOffers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {offer.firstName} {offer.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.variableSymbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.birthDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          offer.status?.includes("uhrazeno") 
                            ? "bg-green-100 text-green-800" 
                            : offer.status?.includes("záloha")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {offer.status || "Nezadáno"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(offer.id)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                        >
                          Zobrazit detail
                        </button>
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

export default ZdravotnikOffers;
