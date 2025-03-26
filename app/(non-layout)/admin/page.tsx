"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../Firebase";
import AdminOffers from "../../../components/AdminOffers";
import AdminUsers from "../../../components/AdminUsers";
import AdminGallery from "../../../components/AdminGallery";
import AdminSponsors from "../../../components/AdminSponsors";
import React from "react";
import { Tab } from '@headlessui/react';

const AdminPage = () => {
    const [role, setRole] = useState<string | null>(null);
    const [allowSubmissions, setAllowSubmissions] = useState(true);
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