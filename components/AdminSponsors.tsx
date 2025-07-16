"use client";
import { useState, useEffect } from "react";
import { db, storage } from "../Firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<Partial<Sponsor>>({});
    const [editingFile, setEditingFile] = useState<File | null>(null);

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

    const startEdit = (sponsor: Sponsor) => {
        setEditingId(sponsor.id);
        setEditingData({
            name: sponsor.name,
            description: sponsor.description,
            website: sponsor.website,
            logoUrl: sponsor.logoUrl
        });
        setEditingFile(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingData({});
        setEditingFile(null);
    };

    const handleUpdate = async (id: string, currentLogoUrl: string) => {
        if (!editingData.name?.trim() || !editingData.description?.trim() || !editingData.website?.trim()) {
            alert("Prosím vyplňte všechna pole.");
            return;
        }

        setUploading(true);
        try {
            let logoUrl = currentLogoUrl;

            // Pokud byl vybrán nový soubor, nahrajeme ho
            if (editingFile) {
                const timestamp = Date.now();
                const fileExtension = editingFile.name.split('.').pop();
                const fileName = `${editingData.name!.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`;
                
                const storageRef = ref(storage, `sponsors/${fileName}`);
                await uploadBytes(storageRef, editingFile);
                logoUrl = await getDownloadURL(storageRef);

                // Smažeme starý soubor
                try {
                    const oldStorageRef = ref(storage, currentLogoUrl);
                    await deleteObject(oldStorageRef);
                } catch (storageError) {
                    console.warn("Nepodařilo se smazat starý soubor ze storage:", storageError);
                }
            }

            await updateDoc(doc(db, "sponsors", id), {
                name: editingData.name!.trim(),
                description: editingData.description!.trim(),
                website: editingData.website!.trim(),
                logoUrl
            });

            // Refresh sponsors
            const querySnapshot = await getDocs(collection(db, "sponsors"));
            const sponsorsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor));
            setSponsors(sponsorsData);

            cancelEdit();
            alert("Sponzor byl úspěšně upraven!");
        } catch (error) {
            console.error("Error updating sponsor:", error);
            alert("Chyba při úpravě sponzora: " + error);
        } finally {
            setUploading(false);
        }
    };

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
                            id="admin-sponsor-pattern"
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
                        fill="url(#admin-sponsor-pattern)"
                        width="100%"
                        height="100%"
                        strokeWidth={0}
                    />
                </svg>
            </div>

            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-base/7 font-semibold text-text-indigo">
                        Administrace
                    </h2>
                    <h1 className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-black tracking-tight text-text-black sm:text-5xl">
                        Správa sponzorů
                    </h1>
                </div>
            
                {/* Formulář pro přidání sponzora */}
                <div className="relative">
                    <div className="absolute inset-px rounded-lg bg-background"></div>
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                        <div className="p-6 bg-white">
                            <h2 className="text-lg font-medium tracking-tight text-text-black mb-6">Přidat nového sponzora</h2>
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
                                    className={`px-6 py-3 rounded-md font-semibold transition-colors ${
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
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
                </div>

            {/* Seznam existujících sponzorů */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="relative group">
                        <div className="absolute inset-px rounded-lg bg-background"></div>
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                            {editingId === sponsor.id ? (
                                // Editační formulář
                                <div className="p-6 bg-white">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Upravit sponzora</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Název sponzora *
                                            </label>
                                            <input
                                                type="text"
                                                value={editingData.name || ""}
                                                onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Webová stránka *
                                            </label>
                                            <input
                                                type="url"
                                                value={editingData.website || ""}
                                                onChange={(e) => setEditingData({...editingData, website: e.target.value})}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Popis *
                                            </label>
                                            <textarea
                                                value={editingData.description || ""}
                                                onChange={(e) => setEditingData({...editingData, description: e.target.value})}
                                                rows={3}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nové logo (volitelné)
                                            </label>
                                            <input
                                                type="file"
                                                onChange={(e) => setEditingFile(e.target.files ? e.target.files[0] : null)}
                                                accept="image/*"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-indigo text-sm"
                                            />
                                            {editingFile && (
                                                <p className="mt-1 text-xs text-gray-600">
                                                    Vybraný soubor: {editingFile.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2 pt-2">
                                            <button
                                                onClick={() => handleUpdate(sponsor.id, sponsor.logoUrl)}
                                                disabled={uploading}
                                                className="flex-1 px-4 py-2 bg-text-indigo text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
                                            >
                                                {uploading ? "Ukládání..." : "Uložit"}
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm font-medium"
                                            >
                                                Zrušit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Zobrazení sponzora
                                <div className="p-6 h-full flex flex-col">
                                    <div className="relative w-full h-20 mb-4 flex items-center justify-center bg-gray-50 rounded-lg">
                                        <Image
                                            src={sponsor.logoUrl}
                                            alt={sponsor.name}
                                            width={120}
                                            height={60}
                                            className="max-h-16 max-w-full object-contain"
                                        />
                                    </div>
                                    
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-medium tracking-tight text-text-black mb-2">
                                            {sponsor.name}
                                        </h3>
                                        <p className="text-sm/6 text-text-secondary mb-2">
                                            {sponsor.description}
                                        </p>
                                        <a 
                                            href={sponsor.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-sm text-text-indigo hover:underline break-all"
                                        >
                                            {sponsor.website}
                                        </a>
                                    </div>
                                    
                                    <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => startEdit(sponsor)}
                                            className="flex-1 px-3 py-2 bg-text-indigo text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                                        >
                                            Upravit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sponsor.id, sponsor.logoUrl, sponsor.name)}
                                            className="flex-1 px-3 py-2 bg-negative-color text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                                        >
                                            Smazat
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}