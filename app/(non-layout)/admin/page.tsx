"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase";
import AdminOffers from "@/components/AdminOffers";
import AdminUsers from "@/components/AdminUsers";
import AdminGallery from "@/components/AdminGallery";
import AdminSponsors from "@/components/AdminSponsors";

const AdminPage = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [selectedTool, setSelectedTool] = useState("gallery");
    const router = useRouter();
    const auth = getAuth();

    const fetchData = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const offersSnapshot = await getDocs(collection(db, "offers"));

            const usersData = usersSnapshot.docs.map(doc => doc.data());
            const offersData = offersSnapshot.docs.map(doc => doc.data());

            console.log("Users:", usersData);
            console.log("Offers:", offersData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getRole = async (uid) => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data().role;
            }
            return null;
        } catch (error) {
            console.error("Error fetching role:", error);
            return null;
        }
    };

    const [stats, setStats] = useState([
        { id: 1, name: 'Registrovaní uživatelé', value: 0 },
        { id: 2, name: 'Vytvořené přihlášky', value: 0 },
        { id: 3, name: 'Uhrazené přihlášky', value: 0 },
    ]);

    const fetchStats = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const offersSnapshot = await getDocs(collection(db, "offers"));

            const usersCount = usersSnapshot.size;
            const offersCount = offersSnapshot.size;
            const paidOffersCount = offersSnapshot.docs.filter(doc => doc.data().status === "uhrazeno").length;

            setStats(prevStats => prevStats.map(stat => {
                if (stat.id === 1) return { ...stat, value: usersCount };
                if (stat.id === 2) return { ...stat, value: offersCount };
                if (stat.id === 3) return { ...stat, value: paidOffersCount };
                return stat;
            }));
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userRole = await getRole(currentUser.uid);
                setRole(userRole);
                if (userRole !== "admin") {
                    router.push("/login");
                }
            } else {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, router]);

    if (role !== "admin") {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="bg-background py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                        {stats.map((stat) => (
                            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base/7 text-text-secondary">{stat.name}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-text-black sm:text-5xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <select
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded"
                >
                    <option value="gallery">Správa Galerie</option>
                    <option value="sponsors">Správa Sponzorů</option>
                    <option value="offers">Správa Přihlášek</option>
                    <option value="users">Správa uživatelů</option>
                </select>
                {selectedTool === "gallery" && <AdminGallery />}
                {selectedTool === "sponsors" && <AdminSponsors />}
                {selectedTool === "offers" && <AdminOffers />}
                {selectedTool === "users" && <AdminUsers />}
            </div>
        </div>
    );
};

export default AdminPage;