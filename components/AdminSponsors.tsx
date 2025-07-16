"use client";
import { useState, useEffect } from "react";
import { db, storage } from "../Firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import Image from 'next/image';

interface Sponsor {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    website: string;
}

export default function AdminSponsors() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [website, setWebsite] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        const fetchSponsors = async () => {
            const querySnapshot = await getDocs(collection(db, "sponsors"));
            const sponsorsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor));
            setSponsors(sponsorsData);
        };

        fetchSponsors();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files ? e.target.files[0] : null);
    };

    const handleUpload = async () => {
        if (!file || !name.trim() || !description.trim() || !website.trim()) {
            alert("Prosím vyplňte všechna pole a vyberte soubor.");
            return;
        }

        setUploading(true);
        try {
            // Vytvoříme unikátní název souboru s timestampem
            const timestamp = Date.now();
            const fileExtension = file.name.split('.').pop();
            const fileName = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`;
            
            const storageRef = ref(storage, `sponsors/${fileName}`);
            await uploadBytes(storageRef, file);
            const logoUrl = await getDownloadURL(storageRef);

            await addDoc(collection(db, "sponsors"), { 
                name: name.trim(), 
                logoUrl, 
                description: description.trim(), 
                website: website.trim() 
            });
            
            // Vyčistíme formulář
            setName("");
            setDescription("");
            setWebsite("");
            setFile(null);
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            // Refresh sponsors
            const querySnapshot = await getDocs(collection(db, "sponsors"));
            const sponsorsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor));
            setSponsors(sponsorsData);
            
            alert("Sponzor byl úspěšně přidán!");
        } catch (error) {
            console.error("Error uploading sponsor:", error);
            alert("Chyba při přidávání sponzora: " + error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, logoUrl: string, sponsorName: string) => {
        if (!confirm(`Opravdu chcete smazat sponzora "${sponsorName}"?`)) {
            return;
        }
        
        try {
            await deleteDoc(doc(db, "sponsors", id));
            
            // Pokusíme se smazat soubor ze storage
            try {
                const storageRef = ref(storage, logoUrl);
                await deleteObject(storageRef);
            } catch (storageError) {
                console.warn("Nepodařilo se smazat soubor ze storage:", storageError);
                // Pokračujeme i když se nepodaří smazat soubor
            }

            // Refresh sponsors
            const querySnapshot = await getDocs(collection(db, "sponsors"));
            const sponsorsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor));
            setSponsors(sponsorsData);
            
            alert("Sponzor byl úspěšně smazán!");
        } catch (error) {
            console.error("Error deleting sponsor:", error);
            alert("Chyba při mazání sponzora: " + error);
        }
    };

    return (
        <div className="px-4 mt-16 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-text-black">Sponzoři</h1>
                </div>
            </div>
            
            {/* Formulář pro přidání sponzora */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Přidat nového sponzora</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Název sponzora *
                        </label>
                        <input
                            type="text"
                            placeholder="Název sponzora"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Webová stránka *
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Popis *
                        </label>
                        <textarea
                            placeholder="Popis sponzora"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo *
                        </label>
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo"
                        />
                        {file && (
                            <p className="mt-2 text-sm text-gray-600">
                                Vybraný soubor: {file.name}
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleUpload}
                        className={`px-6 py-3 rounded-md font-medium transition-colors ${
                            uploading || !file || !name.trim() || !description.trim() || !website.trim()
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-text-indigo text-white hover:bg-indigo-700"
                        }`}
                        disabled={uploading || !file || !name.trim() || !description.trim() || !website.trim()}
                    >
                        {uploading ? "Nahrávání..." : "Přidat sponzora"}
                    </button>
                </div>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="relative">
                        <Image src={sponsor.logoUrl} alt={sponsor.name} width={400} height={256} className="w-full h-64 object-cover rounded" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-background text-center p-2">
                            <h2>{sponsor.name}</h2>
                            <p>{sponsor.description}</p>
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-text-indigo-400 underline">
                                {sponsor.website}
                            </a>
                        </div>
                        <button
                            onClick={() => handleDelete(sponsor.id, sponsor.logoUrl, sponsor.name)}
                            className="absolute top-2 right-2 p-1 bg-negative-color text-background rounded"
                        >
                            Smazat
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}