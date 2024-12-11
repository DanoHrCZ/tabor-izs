"use client";
import { useState, useEffect } from "react";
import { db } from "../../Firebase"; // Import Firebase konfigurace
import { collection, getDocs } from "firebase/firestore";

interface Image {
    id: string;
    url: string;
    album: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<Image[]>([]);
    const [albums, setAlbums] = useState<string[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string>("");

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

    const handleAlbumClick = (album: string) => {
        setSelectedAlbum(album);
        setSelectedImage("");
    };

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
    };

    const handleNextImage = () => {
        const currentIndex = images.findIndex((image) => image.url === selectedImage);
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedImage(images[nextIndex].url);
    };

    const handlePrevImage = () => {
        const currentIndex = images.findIndex((image) => image.url === selectedImage);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setSelectedImage(images[prevIndex].url);
    };

    return (
        <div className="px-4 mt-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-base/7 font-semibold text-text-indigo">
                Podívejte se na naše fotografie
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-black tracking-tight text-text-black sm:text-5xl">
                Galerie
            </p>
            {selectedImage ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <button onClick={handlePrevImage} className="absolute left-4 p-2 bg-background text-black rounded-full">
                        &#9664;
                    </button>
                    <img src={selectedImage} alt="Full size" className="max-w-full max-h-full" onClick={() => setSelectedImage("")} />
                    <button onClick={handleNextImage} className="absolute right-4 p-2 bg-background text-black rounded-full">
                        &#9654;
                    </button>
                </div>
            ) : selectedAlbum ? (
                <div>
                    <button onClick={() => setSelectedAlbum("")} className="mb-4 p-2 bg-text-indigo text-background rounded">
                        Zpět na alba
                    </button>
                    <div className="flex flex-wrap gap-4">
                        {images
                            .filter((image) => image.album === selectedAlbum)
                            .map((image) => (
                                <div key={image.id} className="relative w-64 h-64">
                                    <img src={image.url} alt="Gallery" className="w-full h-full object-cover rounded cursor-pointer" onClick={() => handleImageClick(image.url)} />
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {albums.map((album) => {
                        const albumImages = images.filter((image) => image.album === album);
                        const firstImage = albumImages[0]?.url;
                        return (
                            <div key={album} className="relative w-64 h-64 cursor-pointer" onClick={() => handleAlbumClick(album)}>
                                {firstImage && <img src={firstImage} alt={album} className="w-full h-full object-cover rounded" />}
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-background text-center p-2">
                                    {album}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}