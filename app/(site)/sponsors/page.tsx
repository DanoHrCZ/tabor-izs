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
        <div className="relative isolate overflow-hidden bg-background px-6 py-12 sm:py-16 lg:overflow-visible lg:px-0">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <svg
                    aria-hidden="true"
                    className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,background,transparent)]"
                >
                    <defs>
                        <pattern
                            x="50%"
                            y={-1}
                            id="sponsor-pattern"
                            width={200}
                            height={200}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M100 200V.5M.5 .5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                        <path
                            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect
                        fill="url(#sponsor-pattern)"
                        width="100%"
                        height="100%"
                        strokeWidth={0}
                    />
                </svg>
            </div>
            
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <div className="text-center">
                    <h2 className="text-base/7 font-semibold text-text-indigo">
                        Tábor Integrovaného záchranného systému 2025
                    </h2>
                    <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-black tracking-tight text-text-black sm:text-5xl">
                        Naši sponzoři
                    </p>
                    <p className="mt-6 text-xl/8 text-gray-700 max-w-3xl mx-auto">
                        Děkujeme všem našim sponzorům za podporu. Bez jejich pomoci by nebylo možné realizovat náš tábor a poskytovat dětem nezapomenutelné zážitky.
                    </p>
                </div>
                
                {loading ? (
                    <div className="text-center mt-10">
                        <div className="inline-flex items-center space-x-2">
                            <div className="w-6 h-6 border-2 border-text-indigo border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-base text-text-secondary">Načítání sponzorů...</span>
                        </div>
                    </div>
                ) : sponsors.length === 0 ? (
                    <div className="text-center mt-10">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-text-black mb-2">Žádní sponzoři</h3>
                        <p className="text-text-secondary">V tuto chvíli nemáme žádné sponzory k zobrazení.</p>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3">
                        {sponsors.map((sponsor) => (
                            <div 
                                key={sponsor.id} 
                                className="relative group"
                            >
                                <div className="absolute inset-px rounded-lg bg-background"></div>
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                                    <a 
                                        href={sponsor.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block p-8 h-full hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <div className="flex flex-col items-center text-center h-full">
                                            <div className="relative w-full h-24 mb-6 flex items-center justify-center">
                                                <Image
                                                    alt={sponsor.name}
                                                    src={sponsor.logoUrl}
                                                    width={150}
                                                    height={80}
                                                    className="max-h-20 max-w-full object-contain"
                                                />
                                            </div>
                                            
                                            <div className="flex-grow flex flex-col justify-center">
                                                <h3 className="text-lg font-medium tracking-tight text-text-black mb-4 group-hover:text-text-indigo transition-colors duration-200">
                                                    {sponsor.name}
                                                </h3>
                                                {sponsor.description && (
                                                    <p className="text-sm/6 text-text-secondary leading-relaxed">
                                                        {sponsor.description}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="mt-6 inline-flex items-center text-sm font-semibold text-text-indigo group-hover:text-indigo-600 transition-colors duration-200">
                                                Navštívit web
                                                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}