"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../Firebase'; // Ensure you import db
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth from Firebase

interface OfferData {
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  street: string;
  city: string;
  postalCode: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  contactEmail: string;
  employerContribution: string;
  healthIssues: string;
  medications: string;
  additionalInfo: string;
}

const NewOfferPage = () => {
  const [offerData, setOfferData] = useState<OfferData>({
    userId: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    street: '',
    city: '',
    postalCode: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
    contactEmail: '',
    employerContribution: '',
    healthIssues: '',
    medications: '',
    additionalInfo: ''
  });

  const [userId, setUserId] = useState<string>(''); // Initialize with an empty string
  const [allowSubmissions, setAllowSubmissions] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(); // Get the Firebase auth instance
    const user = auth.currentUser; // Get the currently authenticated user
    if (user) {
      setUserId(user.uid); // Set the user ID in state
      setOfferData(prevState => ({
        ...prevState,
        userId: user.uid
      }));
    } else {
      // Handle the case where the user is not authenticated
      router.push('/auth/login'); // Redirect to login page if not authenticated
    }
  }, [router]);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "submissionSettings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAllowSubmissions(docSnap.data().allowSubmissions);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setOfferData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!allowSubmissions) {
      alert("Odesílání přihlášek je momentálně zakázáno. V případě potřeby nás kontaktujte. Děkujeme za pochopení.");
      return;
    }

    // Input validation
    for (const [key, value] of Object.entries(offerData)) {
      if (value === '' && (key === 'firstName' || key === 'lastName' || key === 'birthDate' || key === 'street' || key === 'city' || key === 'postalCode')) {
        alert(`Prosím vyplňte ${key}.`);
        return;
      }
    }

    try {
      const offersCollection = collection(db, 'offers');
      await addDoc(offersCollection, {
        ...offerData,
        userId: userId // Přidejte userId k uloženým datům
      });
      router.push(`/user/${userId}`); // Přejděte na stránku uživatele při úspěšném odeslání
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Došlo k chybě při ukládání nabídky. Zkuste to prosím znovu.");
    }
  };

  const handleCancel = () => {
    router.push(`/user/${userId}`); // Navigate to user page when canceled
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h2 className="text-2xl font-semibold text-text-black">Nová přihláška</h2>
        <p className="mt-1 text-sm text-text-secondary">Vyplňte prosím informace o vašem dítěti.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: 'Křestní jméno', name: 'firstName', type: 'text', required: true },
            { label: 'Příjmení', name: 'lastName', type: 'text', required: true },
            { label: 'Datum narození', name: 'birthDate', type: 'date', required: true },
            { label: 'Ulice', name: 'street', type: 'text', required: true },
            { label: 'Město', name: 'city', type: 'text', required: true },
            { label: 'PSČ', name: 'postalCode', type: 'text', required: true },
            { label: 'Příspěvek zaměstnavatele', name: 'employerContribution', type: 'text' },
            { label: 'Zdravotní problémy', name: 'healthIssues', type: 'text' },
            { label: 'Užívané léky', name: 'medications', type: 'text' },
          ].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label htmlFor={field.name} className="mb-1 text-sm font-medium text-text-black">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={offerData[field.name as keyof OfferData]} // Cast field.name to keyof OfferData
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required={field.required}
              />
            </div>
          ))}

          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="additional-info" className="mb-1 block text-sm font-medium text-text-black">
              Další informace
            </label>
            <textarea
              id="additional-info"
              name="additionalInfo"
              value={offerData.additionalInfo}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              rows={4}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm font-semibold text-gray-700 hover:text-text-black"
          >
            Zrušit
          </button>
          <button
            type="submit"
            className="rounded-md bg-text-indigo px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Uložit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOfferPage;
