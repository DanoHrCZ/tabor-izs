// FILE: components/AdminGallery.tsx

import { useState, useEffect } from "react";
import { db, storage } from "../Firebase"; // Import Firebase konfigurace
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import Image from 'next/image';

interface Image {
    id: string;
    url: string;
    album: string;
}

export default function AdminGallery() {
    const [images, setImages] = useState<Image[]>([]);
    const [albums, setAlbums] = useState<string[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);
    const [newAlbum, setNewAlbum] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const fetchImages = async () => {
            const querySnapshot = await getDocs(collection(db, "gallery"));
            const imagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Image));
            setImages(imagesData);

            const albumSet = new Set(imagesData.map((image) => image.album));
            setAlbums(Array.from(albumSet));
        };

        fetchImages();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const handleUpload = async () => {
        if (!files || !selectedAlbum) {
            setMessage("Vyberte album a soubory k nahrání.");
            return;
        }

        setUploading(true);
        setMessage("");
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const storageRef = ref(storage, `gallery/${selectedAlbum}/${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);

                await addDoc(collection(db, "gallery"), { url, album: selectedAlbum });
            });

            await Promise.all(uploadPromises);
            setFiles(null);
            (document.getElementById("fileInput") as HTMLInputElement).value = "";

            // Refresh images
            const querySnapshot = await getDocs(collection(db, "gallery"));
            const imagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Image));
            setImages(imagesData);

            setMessage("Obrázky byly úspěšně nahrány.");
        } catch (error) {
            setMessage("Došlo k chybě při nahrávání obrázků.");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (id: string, url: string) => {
        try {
            await deleteDoc(doc(db, "gallery", id));
            const storageRef = ref(storage, url);
            await deleteObject(storageRef);

            // Refresh images
            const querySnapshot = await getDocs(collection(db, "gallery"));
            const imagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Image));
            setImages(imagesData);

            setMessage("Obrázek byl úspěšně smazán.");
        } catch (error) {
            setMessage("Došlo k chybě při mazání obrázku.");
            console.error(error);
        }
    };

    const handleDeleteAlbum = async (album: string) => {
        try {
            const albumQuery = query(collection(db, "gallery"), where("album", "==", album));
            const querySnapshot = await getDocs(albumQuery);

            const deletePromises = querySnapshot.docs.map(async (doc) => {
                const imageData = doc.data() as Image;
                const storageRef = ref(storage, imageData.url);
                await deleteObject(storageRef);
                await deleteDoc(doc.ref);
            });

            await Promise.all(deletePromises);

            // Refresh images and albums
            const allImagesSnapshot = await getDocs(collection(db, "gallery"));
            const imagesData = allImagesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Image));
            setImages(imagesData);

            const albumSet = new Set(imagesData.map((image) => image.album));
            setAlbums(Array.from(albumSet));
            setSelectedAlbum("");

            setMessage("Album bylo úspěšně smazáno.");
        } catch (error) {
            setMessage("Došlo k chybě při mazání alba.");
            console.error(error);
        }
    };

    const handleCreateAlbum = () => {
        if (newAlbum && !albums.includes(newAlbum)) {
            setAlbums([...albums, newAlbum]);
            setSelectedAlbum(newAlbum);
            setNewAlbum("");
            setMessage("Album bylo úspěšně vytvořeno.");
        } else {
            setMessage("Album již existuje nebo je název prázdný.");
        }
    };

    return (
        <div className="px-4 mt-16 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-text-black">Galerie</h1>
                </div>
                <select
                    value={selectedAlbum}
                    onChange={(e) => setSelectedAlbum(e.target.value)}
                    className="mr-2 p-2 border border-gray-300 rounded"
                >
                    <option value="">Vyberte album</option>
                    {albums.map((album) => (
                        <option key={album} value={album}>
                            {album}
                        </option>
                    ))}
                </select>
            </div>
            <input
                type="text"
                placeholder="Nové album"
                value={newAlbum}
                onChange={(e) => setNewAlbum(e.target.value)}
                className="mr-2 p-2 border border-gray-300 rounded"
            />
            <button
                onClick={handleCreateAlbum}
                className="mr-2 p-2 bg-positive-color text-background rounded"
            >
                Vytvořit album
            </button>
            {message && <p className="mt-4 text-center text-negative-color">{message}</p>}
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {images
                    .filter((image) => image.album === selectedAlbum)
                    .map((image) => (
                        <div key={image.id} className="relative">
                            <Image
                                src={image.url}
                                alt="Gallery Image"
                                width={500}
                                height={300}
                            />
                            <button
                                onClick={() => handleDeleteImage(image.id, image.url)}
                                className="absolute top-2 right-2 p-1 bg-negative-color text-background rounded"
                            >
                                Smazat
                            </button>
                        </div>
                    ))}
            </div>
            <div className="sm:flex sm:items-center mt-4 justify-between">
                <div>
                    <button
                        onClick={() => handleDeleteAlbum(selectedAlbum)}
                        className="mr-2 p-2 bg-negative-color text-background rounded"
                        disabled={!selectedAlbum}
                    >
                        Smazat album
                    </button>
                </div>
                <div>
                    <input id="fileInput" type="file" multiple onChange={handleFileChange} />

                    <button
                        onClick={handleUpload}
                        className="ml-2 p-2 bg-text-indigo text-background rounded"
                        disabled={uploading}
                    >
                        {uploading ? "Nahrávání..." : "Nahrát obrázky"}
                    </button>
                </div>
            </div>
        </div>
    );
}