"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../Firebase";
import ZdravotnikOffers from "../../../components/ZdravotnikOffers";
import React from "react";

const ZdravotnikPage = () => {
    const [role, setRole] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalOffers: 0,
        paidOffers: 0,
    });
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const userRole = userDoc.data().role;
                    if (userRole === "zdravotnik" || userRole === "admin") {
                        setRole(userRole);
                    } else {
                        router.push("/login");
                    }
                } else {
                    router.push("/login");
                }
            } else {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, router]);

    useEffect(() => {
        if (role === "zdravotnik" || role === "admin") {
            fetchStats();
        }
    }, [role]);

    const fetchStats = async () => {
        try {
            // Get total offers count
            const offersSnapshot = await getDocs(collection(db, "offers"));
            const offersCount = offersSnapshot.size;

            // Get paid offers count
            const paidOffersQuery = query(
                collection(db, "offers"), 
                where("status", "in", ["uhrazeno", "uhrazena záloha"])
            );
            const paidOffersSnapshot = await getDocs(paidOffersQuery);
            const paidOffersCount = paidOffersSnapshot.size;

            setStats({
                totalOffers: offersCount,
                paidOffers: paidOffersCount
            });
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    if (role !== "zdravotnik" && role !== "admin") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Načítání...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Navigační tlačítka */}
            <div className="mb-4 flex gap-2">
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

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Zdravotnický panel - Přihlášky</h1>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-700">Celkem přihlášek</h2>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalOffers}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-700">Uhrazené přihlášky</h2>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.paidOffers}</p>
                </div>
            </div>
            
            {/* Offers Component */}
            <div className="bg-white rounded-lg shadow">
                <ZdravotnikOffers />
            </div>
        </div>
    );
};

export default ZdravotnikPage;
