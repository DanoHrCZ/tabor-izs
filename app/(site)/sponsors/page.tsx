"use client";
import { useState, useEffect } from "react";
import { db } from "../../../Firebase"; // Import Firebase configuration
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import Image from 'next/image';

interface Sponsor {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    website: string;
}

export default function SponsorsPage() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "sponsors"));
                const sponsorsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                } as Sponsor));
                setSponsors(sponsorsData);
            } catch (error) {
                console.error("Error fetching sponsors:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSponsors();
    }, []);
    
    return (
        <div className="min-h-dvh relative isolate overflow-hidden bg-background px-6 py-12 sm:py-16 lg:overflow-visible lg:px-0">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <svg
                    aria-hidden="true"
                    className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,background,transparent)]"
                >
                    <defs>
                        <pattern
                            x="50%"
                            y={-1}
                            id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                            width={200}
                            height={200}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M100 200V.5M.5 .5H200" fill="none" />
                        </pattern>
                    </defs>
                    <rect
                        fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
                        width="100%"
                        height="100%"
                        strokeWidth={0}
                    />
                </svg>
            </div>
            
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <p className="text-base/7 font-semibold text-text-indigo">
                        Tábor Integrovaného záchranného systému 2025
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-black sm:text-4xl">
                        Naši sponzoři
                    </h2>
                    <p className="mt-6 text-lg text-gray-600">
                        Děkujeme všem našim sponzorům za podporu. Bez jejich pomoci by nebylo možné realizovat náš tábor.
                    </p>
                </div>
                
                {loading ? (
                    <div className="text-center mt-10">Načítání...</div>
                ) : sponsors.length === 0 ? (
                    <div className="text-center mt-10">Žádní sponzoři nebyli nalezeni.</div>
                ) : (
                    <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                        {sponsors.map((sponsor) => (
                            <div key={sponsor.id} className="col-span-2 lg:col-span-1 text-center cursor-pointer">
                                <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                                    <Image
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
                )}
            </div>
        </div>
    );
}