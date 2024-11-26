// firestore.ts
import { db } from './config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface DocumentData {
    [key: string]: any;
}

// Získání všech dokumentů z kolekce
export const getAllDocuments = async (collectionName: string): Promise<DocumentData[]> => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Přidání dokumentu do kolekce
export const addDocument = async (collectionName: string, data: DocumentData): Promise<string> => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
};

// Aktualizace dokumentu v kolekci
export const updateDocument = async (collectionName: string, docId: string, data: DocumentData): Promise<void> => {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
};

// Smazání dokumentu z kolekce
export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
};
