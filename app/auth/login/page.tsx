"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const translateFirebaseError = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "Uživatel s tímto e-mailem neexistuje.";
      case "auth/wrong-password":
        return "Nesprávné heslo.";
      case "auth/invalid-email":
        return "E-mailová adresa není platná.";
      case "auth/user-disabled":
        return "Tento účet je zakázán.";
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

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Získáme ID přihlášeného uživatele
      const userID = userCredential.user.uid;
      console.log('User signed in successfully with ID:', userID);

      // Přesměrujeme na /user/:id
      router.push(`/user/${userID}`);
    } catch (error) {
      const errorMessage = translateFirebaseError(error.code);
      setError(errorMessage);
      console.error('Error signing in user:', error);
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
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Přihlaste se k účtu
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? 'Přihlašování...' : 'Přihlásit se'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Nemáte účet?{' '}
            <a href="/auth/registration" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Zaregistrujte se
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
