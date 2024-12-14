import Link from "next/link"
export default function NotFoundPage() {
  return (
    <>
      <main className="grid min-h-full place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-text-indigo">404</p>
          <h1 className="mt-4 text-pretty text-5xl font-black tracking-tight text-text-black sm:text-7xl">
            Stránka nenalezena
          </h1>
          <p className="mt-6 text-xl/8 text-gray-700">
            Omlouváme se, ale stránku, kterou hledáte, jsme nemohli najít.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-text-indigo px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-indigo"
            >
              Zpět na hlavní stránku
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-text-black">
              Kontaktujte podporu <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
