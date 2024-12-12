"use client";
import { useState, useEffect } from "react";
import { db } from "../../../Firebase"; // Import Firebase configuration
import { collection, getDocs } from "firebase/firestore";

interface Sponsor {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    website: string;
}

export default function SponsorsPage() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);

    useEffect(() => {
        const fetchSponsors = async () => {
            const querySnapshot = await getDocs(collection(db, "sponsors"));
            const sponsorsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor));
            setSponsors(sponsorsData);
        };

        fetchSponsors();
    }, []);

    return (
        <div className="py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-center text-base/7 font-semibold text-text-indigo">
                    představujeme vám
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-black tracking-tight text-text-black sm:text-5xl">
                    Naše sponzory!
                </p>
                <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                    {sponsors.map((sponsor) => (
                        <div key={sponsor.id} className="col-span-2 lg:col-span-1 text-center cursor-pointer">
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                                <img
                                    alt={sponsor.name}
                                    src={sponsor.logoUrl}
                                    width={158}
                                    height={48}
                                    className="max-h-12 w-full object-contain"
                                />
                                <h3 className="mt-4 text-sm font-semibold text-text-black">{sponsor.name}</h3>
                                <p className="mt-2 text-sm text-text-secondary">{sponsor.description}</p>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}