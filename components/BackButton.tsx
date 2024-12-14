"use client";
import Link from 'next/link';

export default function BackButton() {

  return (
    <Link
      href="/"
      className="rounded-md bg-text-indigo px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-indigo"
    >
      Zpět na hlavní stránku
    </Link>
  );
}