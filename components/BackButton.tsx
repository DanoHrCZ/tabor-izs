"use client";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

let text: string = "< Vrátit se";

export default function BackButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <a
    href="/"
    className="rounded-md bg-text-indigo px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-indigo"
  >
    Zpět na hlavní stránku
  </a>
  );
}