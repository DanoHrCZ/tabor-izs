// FILE: components/AdminSponsors.tsx

import { useState, useEffect } from "react";
import { db, storage } from "../Firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
        if (!file || !name || !description || !website) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `sponsors/${file.name}`);
            await uploadBytes(storageRef, file);
            const logoUrl = await getDownloadURL(storageRef);

            await addDoc(collection(db, "sponsors"), { name, logoUrl, description, website });
            setName("");
            setDescription("");
            setWebsite("");
            setFile(null);

            // Refresh sponsors
            const querySnapshot = await getDocs(collection(db, "sponsors"));
            const sponsorsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor));
            setSponsors(sponsorsData);
        } catch (error) {
            console.error("Error uploading sponsor:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, logoUrl: string) => {
        try {
            await deleteDoc(doc(db, "sponsors", id));
            const storageRef = ref(storage, logoUrl);
            await deleteObject(storageRef);

            // Refresh sponsors
            const querySnapshot = await getDocs(collection(db, "sponsors"));
            const sponsorsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor));
            setSponsors(sponsorsData);
        } catch (error) {
            console.error("Error deleting sponsor:", error);
        }
    };

    return (
        <div className="px-4 mt-16 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Sponzoři</h1>
                </div>
                <div className="sm:flex sm:items-center sm:ml-4">
                    <input
                        type="text"
                        placeholder="Název sponzora"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mr-2 p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Popisek"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mr-2 p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Webová stránka"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="mr-2 p-2 border border-gray-300 rounded"
                    />
                    <input type="file" onChange={handleFileChange} />
                    <button
                        onClick={handleUpload}
                        className="ml-2 p-2 bg-blue-600 text-white rounded"
                        disabled={uploading}
                    >
                        {uploading ? "Nahrávání..." : "Přidat sponzora"}
                    </button>
                </div>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="relative">
                        <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-64 object-cover rounded" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-2">
                            <h2>{sponsor.name}</h2>
                            <p>{sponsor.description}</p>
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                                {sponsor.website}
                            </a>
                        </div>
                        <button
                            onClick={() => handleDelete(sponsor.id, sponsor.logoUrl)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded"
                        >
                            Smazat
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}