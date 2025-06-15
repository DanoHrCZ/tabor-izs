"use client";


import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../Firebase";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.vfs;

interface Message {
  id: string;
  childName: string;
  message: string;
  senderName: string;
  timestamp: Timestamp | null;
  isAnonymous: boolean;
  offerId: string;
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(
    new Set()
  );
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "child" | "sender">("date");

  const fetchMessages = async () => {
    try {
      const messagesQuery = query(
        collection(db, "messages"),
        orderBy("timestamp", "desc")
      );
      const messagesDocs = await getDocs(messagesQuery);
      const messagesData = messagesDocs.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Message)
      );
      setMessages(messagesData);
      setFilteredMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (confirm("Opravdu chcete smazat tuto zprávu?")) {
      try {
        await deleteDoc(doc(db, "messages", messageId));
        const updatedMessages = messages.filter((msg) => msg.id !== messageId);
        setMessages(updatedMessages);
        setFilteredMessages(
          updatedMessages.filter((msg) => filterMessage(msg))
        );
        setSelectedMessages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const filterMessage = useCallback((message: Message) => {
    const matchesSearch =
      searchTerm === "" ||
      message.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      dateFilter === "" ||
      message.timestamp?.toDate?.()?.toISOString?.().split("T")[0] ===
        dateFilter;

    return matchesSearch && matchesDate;
  }, [searchTerm, dateFilter]);

  const sortMessages = useCallback((messages: Message[]) => {
    return [...messages].sort((a, b) => {
      switch (sortBy) {
        case "child":
          return a.childName.localeCompare(b.childName);
        case "sender":
          return a.senderName.localeCompare(b.senderName);
        case "date":
        default:
          const aTime = a.timestamp?.toDate?.()?.getTime() || 0;
          const bTime = b.timestamp?.toDate?.()?.getTime() || 0;
          return bTime - aTime;
      }
    });
  }, [sortBy]);

  useEffect(() => {
    const filtered = messages.filter(filterMessage);
    const sorted = sortMessages(filtered);
    setFilteredMessages(sorted);
  }, [messages, filterMessage, sortMessages]);

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedMessages(new Set(filteredMessages.map((msg) => msg.id)));
  };

  const deselectAll = () => {
    setSelectedMessages(new Set());
  };

  const exportToPDF = () => {
    if (selectedMessages.size === 0) {
      alert("Vyberte alespoň jednu zprávu pro export.");
      return;
    }

    const selectedMessagesData = messages.filter((msg) =>
      selectedMessages.has(msg.id)
    );

    const content: Content[] = [
      {
        text: 'Zprávy pro děti',
        style: 'header',
        alignment: 'center',
      },
      {
        text: `Vygenerováno: ${new Date().toLocaleDateString("cs-CZ")}`,
        style: 'subheader',
        margin: [0, 10, 0, 20],
      },
    ];

    selectedMessagesData.forEach((message, index) => {
      if (index > 0) {
        content.push({ text: '', pageBreak: 'before' });
      }

      content.push({
        stack: [
          {
            text: `Pro: ${message.childName}`,
            style: 'messageHeader',
          },
          {
            columns: [
              {
                text: `Od: ${message.senderName}${message.isAnonymous ? " (Anonymní)" : ""}`,
                style: 'messageInfo',
              },
              {
                text: `Datum: ${message.timestamp?.toDate?.()?.toLocaleDateString?.("cs-CZ") || "Neznámé datum"}`,
                style: 'messageInfo',
                alignment: 'right',
              },
            ],
            margin: [0, 5, 0, 10],
          },
          {
            text: message.message,
            style: 'messageContent',
            margin: [10, 0, 0, 20],
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 1,
                dash: { length: 3, space: 3 },
                lineColor: '#CCCCCC',
              },
            ],
            margin: [0, 10, 0, 20],
          },
        ],
      });
    });

    const docDefinition: TDocumentDefinitions = {
      content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 12,
          margin: [0, 0, 0, 5],
        },
        messageHeader: {
          fontSize: 14,
          bold: true,
          color: '#2563EB',
        },
        messageInfo: {
          fontSize: 10,
          color: '#666666',
        },
        messageContent: {
          fontSize: 11,
          lineHeight: 1.3,
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMake.createPdf(docDefinition).download(`zpravy_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-indigo"></div>
        <span className="ml-2 text-text-black">Načítání zpráv...</span>
      </div>
    );

  return (
    <div className="px-4 mt-16 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-text-black">
            Zprávy pro děti
          </h1>
        </div>
      </div>

      {/* Filtry a vyhledávání */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-black mb-2">
            Vyhledávání
          </label>
          <input
            type="text"
            placeholder="Hledat ve zprávách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-black mb-2">
            Datum
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-black mb-2">
            Řazení
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "child" | "sender")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo"
          >
            <option value="date">Podle data</option>
            <option value="child">Podle jména dítěte</option>
            <option value="sender">Podle odesílatele</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-black mb-2">
            Akce
          </label>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-2 text-xs bg-text-indigo text-background rounded-md hover:bg-indigo-500 transition-colors"
            >
              Vše
            </button>
            <button
              onClick={deselectAll}
              className="px-3 py-2 text-xs bg-gray-500 text-background rounded-md hover:bg-gray-600 transition-colors"
            >
              Nic
            </button>
          </div>
        </div>
      </div>

      {/* Export tlačítko */}
      <div className="mb-6">
        <button
          onClick={exportToPDF}
          disabled={selectedMessages.size === 0}
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            selectedMessages.size > 0
              ? "bg-positive-color text-background hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Exportovat vybrané do PDF ({selectedMessages.size})
        </button>
      </div>

      {/* Statistiky */}
      <div className="bg-background rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-text-indigo">
              {messages.length}
            </div>
            <div className="text-sm text-text-black">Celkem zpráv</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-positive-color">
              {filteredMessages.length}
            </div>
            <div className="text-sm text-text-black">Zobrazeno</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-500">
              {selectedMessages.size}
            </div>
            <div className="text-sm text-text-black">Vybráno</div>
          </div>
        </div>
      </div>

      {/* Zprávy */}
      {filteredMessages.length === 0 ? (
        <div className="bg-background rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <p className="text-text-black text-lg">
            Žádné zprávy nebyly nalezeny.
          </p>
        </div>
      ) : (
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-background rounded-lg shadow border-l-4 transition-all duration-200 hover:shadow-md ${
                      selectedMessages.has(message.id)
                        ? "border-l-text-indigo bg-indigo-50"
                        : "border-l-gray-200"
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedMessages.has(message.id)}
                            onChange={() => toggleMessageSelection(message.id)}
                            className="mt-1 h-4 w-4 text-text-indigo border-gray-300 rounded focus:ring-text-indigo"
                          />
                          <div>
                            <h3 className="text-xl font-semibold text-text-black mb-1">
                              {message.childName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center">
                                {message.senderName}
                                {message.isAnonymous && (
                                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                    Anonymní
                                  </span>
                                )}
                              </span>
                              <span className="flex items-center">
                                {message.timestamp
                                  ?.toDate?.()
                                  ?.toLocaleString?.() || "Neznámé datum"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="text-negative-color hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                          title="Smazat zprávu"
                        >
                          smazat
                        </button>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-text-black whitespace-pre-wrap leading-relaxed">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
