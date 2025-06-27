"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import * as XLSX from 'xlsx';

// Set fonts for pdfMake
pdfMake.vfs = pdfFonts.vfs;

interface Offer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  street: string;
  city: string;
  postalCode: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  contactEmail: string;
  employerContribution: string;
  healthIssues: string;
  medications: string;
  additionalInfo: string;
  status: string;
  variableSymbol: string;
  createdAt: any;
  payments?: Array<{ date: string; amount: number }>;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    if (window.confirm("Opravdu chcete smazat vybrané položky?")) {
      const deletePromises = selectedOffers.map((offerId) =>
        deleteOffer(offerId)
      );
      await Promise.all(deletePromises);
      setSelectedOffers([]);
    }
  };

  const updateStatus = async (offerId: string, newStatus: string): Promise<void> => {
    const offerRef = doc(db, "offers", offerId);
    await updateDoc(offerRef, { status: newStatus });
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === offerId ? { ...offer, status: newStatus } : offer
      )
    );
  };

  const deleteOffer = async (offerId: string): Promise<void> => {
    const offerRef = doc(db, "offers", offerId);
    await deleteDoc(offerRef);
    setOffers((prevOffers) =>
      prevOffers.filter((offer) => offer.id !== offerId)
    );
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (newStatus === "") return;
    if (window.confirm("Opravdu chcete změnit stav vybraných položek?")) {
      const updatePromises = selectedOffers.map((offerId) =>
        updateStatus(offerId, newStatus)
      );
      await Promise.all(updatePromises);
      setSelectedOffers([]);
    }
  };

  const addPaymentToOffers = async (amount: number) => {
    if (window.confirm("Opravdu chcete přidat platbu k vybraným položkám?")) {
      const today = new Date().toLocaleDateString("cs-CZ");

      const updatePromises = selectedOffers.map((offerId) => {
        const offer = offers.find((o) => o.id === offerId);
        const payments = offer?.payments || [];
        const newPayments = [...payments, { date: today, amount }];

        // Calculate total paid amount
        const totalPaid = newPayments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );

        const offerRef = doc(db, "offers", offerId);
        return updateDoc(offerRef, {
          payments: newPayments,
          status: `uhrazeno celkem ${totalPaid} Kč`,
        }).then(() => {
          setOffers((prevOffers) =>
            prevOffers.map((offer) =>
              offer.id === offerId
                ? {
                    ...offer,
                    payments: newPayments,
                    status: `uhrazeno celkem ${totalPaid} Kč`,
                  }
                : offer
            )
          );
        });
      });

      await Promise.all(updatePromises);
      setSelectedOffers([]);
    }
  };

  const exportToPDF = () => {
    if (selectedOffers.length === 0) {
      alert("Vyberte alespoň jednu přihlášku pro export.");
      return;
    }

    const selectedOffersData = offers.filter((offer) =>
      selectedOffers.includes(offer.id)
    );

    // Připrava dat pro tabulku
    const tableBody: Content[][] = [
      // Hlavička tabulky
      [
        { text: 'Jméno', style: 'tableHeader' },
        { text: 'Var. symbol', style: 'tableHeader' },
        { text: 'Datum nar.', style: 'tableHeader' },
        { text: 'Stav', style: 'tableHeader' }
      ] as Content[]
    ];

    // Přidání dat
    selectedOffersData.forEach((offer) => {
      const row: Content[] = [
        { text: `${offer.firstName} ${offer.lastName}`, style: 'tableCell' },
        { text: offer.variableSymbol || '', style: 'tableCell' },
        { text: offer.birthDate || '', style: 'tableCell' },
        { text: offer.status || '', style: 'tableCell' }
      ];
      
      tableBody.push(row);

      // Přidání historie plateb pokud existuje
      if (offer.payments && offer.payments.length > 0) {
        const paymentsText = offer.payments
          .map((p) => `${p.date}: ${p.amount} Kč`)
          .join(', ');
        
        tableBody.push([
          { text: `Platby: ${paymentsText}`, colSpan: 4, style: 'paymentHistory' },
          { text: '' },
          { text: '' },
          { text: '' }
        ] as Content[]);
      }
    });

    const docDefinition: TDocumentDefinitions = {
      content: [
        // Hlavička dokumentu
        {
          text: 'Seznam vybraných přihlášek',
          style: 'header',
          alignment: 'center'
        } as Content,
        {
          columns: [
            { text: `Vygenerováno: ${new Date().toLocaleDateString("cs-CZ")}`, style: 'subheader' },
            { text: `Celkem přihlášek: ${selectedOffersData.length}`, style: 'subheader', alignment: 'right' }
          ] as Content[],
          margin: [0, 10, 0, 20]
        } as Content,
        // Tabulka
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', '*'],
            body: tableBody
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return (rowIndex === 0) ? '#CCCCCC' : (rowIndex % 2 === 0 ? '#F3F3F3' : null);
            }
          }
        } as Content
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 12,
          margin: [0, 0, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        },
        paymentHistory: {
          fontSize: 9,
          italics: true,
          color: '#666666',
          margin: [5, 2, 0, 2]
        },
        tableCell: {
          fontSize: 10,
          margin: [0, 2, 0, 2],
        },
      },
      defaultStyle: {
        fontSize: 10
      }
    };

    pdfMake.createPdf(docDefinition).download(`prihlasky_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const exportAllToPDF = () => {
    // Statistiky podle stavu
    const statusCounts = filteredOffers.reduce((acc, offer) => {
      const status = offer.status || "nezadáno";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Statistická tabulka
    const statsTableBody: Content[][] = [
      [{ text: 'Stav', style: 'tableHeader' }, { text: 'Počet', style: 'tableHeader' }] as Content[]
    ];
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      statsTableBody.push([
        { text: status, style: 'tableCell' },
        { text: `${count}x`, style: 'tableCell' }
      ] as Content[]);
    });

    // Hlavní tabulka s přihláškami
    const mainTableBody: Content[][] = [
      [
        { text: 'Jméno', style: 'tableHeader' },
        { text: 'Var. symbol', style: 'tableHeader' },
        { text: 'Datum nar.', style: 'tableHeader' },
        { text: 'Stav', style: 'tableHeader' }
      ] as Content[]
    ];

    filteredOffers.forEach((offer) => {
      const status = (offer.status?.length ?? 0) > 25 
        ? offer.status!.substring(0, 25) + "..." 
        : offer.status || "";
      
      mainTableBody.push([
        { text: `${offer.firstName || ""} ${offer.lastName || ""}`, style: 'tableCell' },
        { text: offer.variableSymbol || "", style: 'tableCell' },
        { text: offer.birthDate || "", style: 'tableCell' },
        { text: status, style: 'tableCell' }
      ] as Content[]);
    });

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: 'Seznam všech přihlášek',
          style: 'header',
          alignment: 'center',
        } as Content,
        {
          columns: [
            { text: `Vygenerováno: ${new Date().toLocaleDateString("cs-CZ")}`, style: 'subheader' },
            { text: `Celkem přihlášek: ${filteredOffers.length}`, style: 'subheader', alignment: 'right' },
          ] as Content[],
          margin: [0, 10, 0, 20],
        } as Content,
        {
          text: 'Statistiky podle stavu',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10],
        } as Content,
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: statsTableBody,
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        } as Content,
        {
          text: 'Přehled všech přihlášek',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10],
        } as Content,
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', '*'],
            body: mainTableBody,
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0 ? '#CCCCCC' : rowIndex % 2 === 0 ? '#F3F3F3' : null;
            },
          },
        } as Content,
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        subheader: {
          fontSize: 12,
          margin: [0, 0, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
        },
        tableCell: {
          fontSize: 10,
          margin: [0, 2, 0, 2],
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
      footer: function (currentPage: number, pageCount: number) {
        return {
          text: `Strana ${currentPage} z ${pageCount}`,
          alignment: 'right',
          margin: [0, 0, 20, 0],
        };
      },
    };

    pdfMake.createPdf(docDefinition).download(`vsechny_prihlasky_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Excel export functions
  const exportToExcel = async () => {
    if (selectedOffers.length === 0) {
      alert("Vyberte alespoň jednu přihlášku pro export.");
      return;
    }

    const selectedOffersData = offers.filter((offer) =>
      selectedOffers.includes(offer.id)
    );

    // Fetch user data for each offer
    const enrichedData = await Promise.all(
      selectedOffersData.map(async (offer) => {
        let userData: UserData | null = null;
        if (offer.userId) {
          try {
            const userDoc = await getDoc(doc(db, "users", offer.userId));
            if (userDoc.exists()) {
              userData = userDoc.data() as UserData;
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }

        return {
          "Variabilní symbol": offer.variableSymbol || "",
          "Jméno dítěte": offer.firstName || "",
          "Příjmení dítěte": offer.lastName || "",
          "Datum narození": offer.birthDate || "",
          "Ulice": offer.street || "",
          "Město": offer.city || "",
          "PSČ": offer.postalCode || "",
          "Příspěvek zaměstnavatele": offer.employerContribution || "",
          "Zdravotní problémy": offer.healthIssues || "",
          "Léky": offer.medications || "",
          "Další informace": offer.additionalInfo || "",
          "Stav": offer.status || "",
          "Datum vytvoření": offer.createdAt?.toDate?.()?.toLocaleDateString("cs-CZ") || "",
          "Jméno rodiče": userData ? `${userData.firstName} ${userData.lastName}` : "",
          "Email rodiče": userData?.email || "",
          "Telefon rodiče": userData?.phone || "",
          "Platby": offer.payments 
            ? offer.payments.map(p => `${p.date}: ${p.amount} Kč`).join("; ") 
            : "",
          "Celkem uhrazeno": offer.payments 
            ? offer.payments.reduce((sum, p) => sum + p.amount, 0) + " Kč"
            : "0 Kč"
        };
      })
    );

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(enrichedData);

    // Auto-size columns
    const colWidths = Object.keys(enrichedData[0] || {}).map(key => {
      const maxLength = Math.max(
        key.length,
        ...enrichedData.map(row => String(row[key as keyof typeof row]).length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Vybrané přihlášky");
    XLSX.writeFile(wb, `vybrane_prihlasky_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const exportAllToExcel = async () => {
    // Fetch user data for all offers
    const enrichedData = await Promise.all(
      filteredOffers.map(async (offer) => {
        let userData: UserData | null = null;
        if (offer.userId) {
          try {
            const userDoc = await getDoc(doc(db, "users", offer.userId));
            if (userDoc.exists()) {
              userData = userDoc.data() as UserData;
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }

        return {
          "Variabilní symbol": offer.variableSymbol || "",
          "Jméno dítěte": offer.firstName || "",
          "Příjmení dítěte": offer.lastName || "",
          "Datum narození": offer.birthDate || "",
          "Ulice": offer.street || "",
          "Město": offer.city || "",
          "PSČ": offer.postalCode || "",
          "Příspěvek zaměstnavatele": offer.employerContribution || "",
          "Zdravotní problémy": offer.healthIssues || "",
          "Léky": offer.medications || "",
          "Další informace": offer.additionalInfo || "",
          "Stav": offer.status || "",
          "Datum vytvoření": offer.createdAt?.toDate?.()?.toLocaleDateString("cs-CZ") || "",
          "Jméno rodiče": userData ? `${userData.firstName} ${userData.lastName}` : "",
          "Email rodiče": userData?.email || "",
          "Telefon rodiče": userData?.phone || "",
          "Platby": offer.payments 
            ? offer.payments.map(p => `${p.date}: ${p.amount} Kč`).join("; ") 
            : "",
          "Celkem uhrazeno": offer.payments 
            ? offer.payments.reduce((sum, p) => sum + p.amount, 0) + " Kč"
            : "0 Kč"
        };
      })
    );

    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    // Main data sheet
    const ws = XLSX.utils.json_to_sheet(enrichedData);
    
    // Auto-size columns
    const colWidths = Object.keys(enrichedData[0] || {}).map(key => {
      const maxLength = Math.max(
        key.length,
        ...enrichedData.map(row => String(row[key as keyof typeof row]).length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, "Všechny přihlášky");

    // Statistics sheet
    const statusCounts = filteredOffers.reduce((acc, offer) => {
      const status = offer.status || "nezadáno";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statsData = Object.entries(statusCounts).map(([status, count]) => ({
      "Stav": status,
      "Počet": count,
      "Procento": `${((count / filteredOffers.length) * 100).toFixed(1)}%`
    }));

    const statsWs = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsWs, "Statistiky");

    XLSX.writeFile(wb, `vsechny_prihlasky_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // Calculate statistics
  const totalOffers = offers.length;
  const filteredCount = filteredOffers.length;
  const selectedCount = selectedOffers.length;
  const paidCount = offers.filter(offer => 
    offer.status?.includes('uhrazeno') || offer.status?.includes('záloha')
  ).length;

  return (
    <div className="px-4 mt-16 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-text-black">
            Přihlášky
          </h1>
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
            <option value="uhrazena záloha">změnit na &quot;uhrazená záloha&quot;</option>
            <option value="uhrazeno">Změnit na &quot;uhrazeno&quot;</option>
            <option value="custom">Uhrazená částka (vlastní)</option>
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

      {/* Export tlačítka */}
      <div className="mt-4 mb-4 flex gap-4">
        <button
          onClick={exportToPDF}
          disabled={selectedOffers.length === 0}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            selectedOffers.length > 0
              ? "bg-positive-color text-background hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Exportovat vybrané do PDF ({selectedOffers.length})
        </button>

        <button
          onClick={exportAllToPDF}
          disabled={filteredOffers.length === 0}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            filteredOffers.length > 0
              ? "bg-text-indigo text-background hover:bg-indigo-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Exportovat všechny do PDF ({filteredOffers.length})
        </button>

        <button
          onClick={exportToExcel}
          disabled={selectedOffers.length === 0}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            selectedOffers.length > 0
              ? "bg-green-500 text-background hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Exportovat vybrané do Excelu ({selectedOffers.length})
        </button>

        <button
          onClick={exportAllToExcel}
          disabled={filteredOffers.length === 0}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            filteredOffers.length > 0
              ? "bg-blue-500 text-background hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Exportovat všechny do Excelu ({filteredOffers.length})
        </button>
      </div>

      {/* Statistiky */}
      <div className="bg-background rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-text-indigo">
              {totalOffers}
            </div>
            <div className="text-sm text-text-black">Celkem přihlášek</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-positive-color">
              {filteredCount}
            </div>
            <div className="text-sm text-text-black">Zobrazeno</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-500">
              {selectedCount}
            </div>
            <div className="text-sm text-text-black">Vybráno</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {paidCount}
            </div>
            <div className="text-sm text-text-black">Uhrazeno</div>
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
                      <input
                        type="checkbox"
                        checked={selectedOffers.length === filteredOffers.length && filteredOffers.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-text-indigo border-gray-300 rounded focus:ring-text-indigo"
                      />
                    </th>
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
                    <tr key={offer.id} className={selectedOffers.includes(offer.id) ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOffers.includes(offer.id)}
                          onChange={() => handleSelectOffer(offer.id)}
                          className="h-4 w-4 text-text-indigo border-gray-300 rounded focus:ring-text-indigo"
                        />
                      </td>
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
                        <select
                          value={offer.status || ''}
                          onChange={(e) => updateStatus(offer.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Nezadáno</option>
                          <option value="neuhrazeno">Neuhrazeno</option>
                          <option value="uhrazena záloha">Uhrazena záloha</option>
                          <option value="uhrazeno">Uhrazeno</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Smazat
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

export default AdminOffers;