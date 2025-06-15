"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../Firebase";
import AdminOffers from "../../../components/AdminOffers";
import AdminUsers from "../../../components/AdminUsers";
import AdminGallery from "../../../components/AdminGallery";
import AdminSponsors from "../../../components/AdminSponsors";
import AdminMessages from "../../../components/AdminMessages";
import React from "react";
import { Tab } from '@headlessui/react';

const AdminPage = () => {
    const [role, setRole] = useState<string | null>(null);
    const [allowSubmissions, setAllowSubmissions] = useState(true);
    const [stats, setStats] = useState({
        totalOffers: 0,
        paidOffers: 0,
        totalUsers: 0
    });
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
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
        if (role === "admin") {
            fetchStats();
        }
    }, [role]);

    const fetchStats = async () => {
        try {
            // Get total users count
            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersCount = usersSnapshot.size;

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
                totalUsers: usersCount,
                totalOffers: offersCount,
                paidOffers: paidOffersCount
            });
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    const toggleSubmissions = async () => {
        const newStatus = !allowSubmissions;
        setAllowSubmissions(newStatus);
        await updateDoc(doc(db, "settings", "submissionSettings"), {
            allowSubmissions: newStatus
        });
    };

    if (role !== "admin") {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={toggleSubmissions}
                    className={`p-2 rounded ${allowSubmissions ? 'bg-red-500' : 'bg-green-500'} text-white`}
                >
                    {allowSubmissions ? "Zakázat odesílání přihlášek" : "Povolit odesílání přihlášek"}
                </button>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-700">Registrovaní uživatelé</h2>
                    <p className="text-3xl font-bold text-text-indigo mt-2">{stats.totalUsers}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-700">Vytvořené přihlášky</h2>
                    <p className="text-3xl font-bold text-text-indigo mt-2">{stats.totalOffers}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-700">Uhrazené přihlášky</h2>
                    <p className="text-3xl font-bold text-text-indigo mt-2">{stats.paidOffers}</p>
                </div>
            </div>
            
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-block p-1">
                    <Tab className={({ selected }) =>
                        selected ? 'w-full py-2.5 text-sm font-bold text-text-indigo rounded-lg bg-background shadow'
                            : 'w-full py-2.5 text-sm font-medium text-background'
                    }>
                        Galerie
                    </Tab>
                    <Tab className={({ selected }) =>
                        selected ? 'w-full py-2.5 text-sm font-bold text-text-indigo rounded-lg bg-background shadow'
                            : 'w-full py-2.5 text-sm font-medium text-background'
                    }>
                        Sponzoři
                    </Tab>
                    <Tab className={({ selected }) =>
                        selected ? 'w-full py-2.5 text-sm font-bold text-text-indigo rounded-lg bg-background shadow'
                            : 'w-full py-2.5 text-sm font-medium text-background'
                    }>
                        Zprávy
                    </Tab>
                    <Tab className={({ selected }) =>
                        selected ? 'w-full py-2.5 text-sm font-bold text-text-indigo rounded-lg bg-background shadow'
                            : 'w-full py-2.5 text-sm font-medium text-background'
                    }>
                        Přihlášky
                    </Tab>
                    <Tab className={({ selected }) =>
                        selected ? 'w-full py-2.5 text-sm font-bold text-text-indigo rounded-lg bg-background shadow'
                            : 'w-full py-2.5 text-sm font-medium text-background'
                    }>
                        Uživatelé
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                    <Tab.Panel>
                        <AdminGallery />
                    </Tab.Panel>
                    <Tab.Panel>
                        <AdminSponsors />
                    </Tab.Panel>
                    <Tab.Panel>
                        <AdminMessages />
                    </Tab.Panel>
                    <Tab.Panel>
                        <AdminOffers />
                    </Tab.Panel>
                    <Tab.Panel>
                        <AdminUsers />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default AdminPage;