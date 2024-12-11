"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegistrationPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{9}$/; // Telefonní číslo musí mít 9 číslic
    return re.test(phone);
  };

  const translateFirebaseError = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Tento e-mail je již používán.";
      case "auth/invalid-email":
        return "E-mailová adresa není platná.";
      case "auth/weak-password":
        return "Heslo musí obsahovat alespoň 6 znaků.";
      case "auth/operation-not-allowed":
        return "Registrace pomocí e-mailu a hesla je momentálně zakázána.";
      case "auth/network-request-failed":
        return "Chyba sítě. Zkontrolujte připojení k internetu a zkuste to znovu.";
      default:
        return "Došlo k neočekávané chybě. Zkuste to prosím znovu.";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Neplatný formát e-mailu");
      return;
    }

    if (!validatePhone(phone)) {
      setError("Telefonní číslo musí mít 9 číslic.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Hesla se neshodují.");
      return;
    }

    if (password.length < 6) {
      setError("Heslo musí mít alespoň 6 znaků.");
      return;
    }

    setLoading(true);
    try {
      // Vytvoření uživatele
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid;

      // Uložení dalších informací do Firestore
      await setDoc(doc(db, "users", userID), {
        firstName,
        lastName,
        phone,
        email,
        createdAt: new Date(),
      });

      console.log('Uživatel zaregistrován a informace uloženy do Firestore.');

      // Přesměrování na stránku s úspěšným vytvořením účtu
      router.push(`/user/${userID}`);

    } catch (error) {
      const errorMessage = translateFirebaseError(error.code);
      setError(errorMessage);
      console.error('Chyba při registraci uživatele:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-text-black">
            Vytvořte si účet
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500">{error}</p>}

            {/* First Name Field */}
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-text-black">
                Jméno
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-text-indigo"
                />
              </div>
            </div>

            {/* Last Name Field */}
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-text-black">
                Příjmení
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-text-indigo"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-black">
                Telefonní číslo
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-text-indigo"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-black">
                E-mailová adresa
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-text-indigo"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-black">
                Heslo
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-text-indigo"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-text-black">
                Potvrďte heslo
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-text-indigo"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md bg-text-indigo px-3 py-1.5 text-sm font-semibold text-background shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-indigo ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? 'Vytváření účtu...' : 'Vytvořit účet'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Už máte účet?{' '}
            <a href="/login" className="font-semibold text-text-indigo hover:text-indigo-500">
              Přihlásit se
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
