"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../Firebase'; // Ensure you import db
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth from Firebase

const NewOfferPage = () => {
  const [offerData, setOfferData] = useState({
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

  const [userId, setUserId] = useState(null); // State to hold user ID
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(); // Get the Firebase auth instance
    const user = auth.currentUser; // Get the currently authenticated user
    if (user) {
      setUserId(user.uid); // Set the user ID in state
    } else {
      // Handle the case where the user is not authenticated
      router.push('/auth/login'); // Redirect to login page if not authenticated
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOfferData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input validation
    for (const [key, value] of Object.entries(offerData)) {
      if (value === '' && (key === 'firstName' || key === 'lastName' || key === 'birthDate' || key === 'street' || key === 'city' || key === 'postalCode' || key === 'fatherName' || key === 'motherName' || key === 'contactEmail')) {
        alert(`Prosím vyplňte ${key}.`); // Alert for required fields
        return;
      }
    }

    try {
      const offersCollection = collection(db, 'offers');
      await addDoc(offersCollection, offerData);
      router.push(`/user/${userId}`); // Navigate to user page on successful submission
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
        <h2 className="text-2xl font-semibold text-gray-900">Nová nabídka</h2>
        <p className="mt-1 text-sm text-gray-600">Prosím vyplňte níže uvedené informace.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: 'Křestní jméno', name: 'firstName', type: 'text', required: true },
            { label: 'Příjmení', name: 'lastName', type: 'text', required: true },
            { label: 'Datum narození', name: 'birthDate', type: 'date', required: true },
            { label: 'Ulice', name: 'street', type: 'text', required: true },
            { label: 'Město', name: 'city', type: 'text', required: true },
            { label: 'PSČ', name: 'postalCode', type: 'text', required: true },
            { label: 'Jméno a příjmení rodiče (otce)', name: 'fatherName', type: 'text', required: true },
            { label: 'Kontaktní telefon (otce)', name: 'fatherPhone', type: 'tel' },
            { label: 'Jméno a příjmení rodiče (matky)', name: 'motherName', type: 'text', required: true },
            { label: 'Kontaktní telefon (matky)', name: 'motherPhone', type: 'tel' },
            { label: 'Kontaktní e-mail', name: 'contactEmail', type: 'email', required: true },
            { label: 'Příspěvek zaměstnavatele', name: 'employerContribution', type: 'text' },
            { label: 'Zdravotní problémy', name: 'healthIssues', type: 'text' },
            { label: 'Užívané léky', name: 'medications', type: 'text' },
          ].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label htmlFor={field.name} className="mb-1 text-sm font-medium text-gray-900">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={offerData[field.name]}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required={field.required}
              />
            </div>
          ))}

          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="additional-info" className="mb-1 block text-sm font-medium text-gray-900">
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
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            Zrušit
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Uložit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOfferPage;
