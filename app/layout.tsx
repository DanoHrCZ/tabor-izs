import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Tábor IZS",
  description: "Tábor IZS",
};

const montserrat = localFont({
  src: [
    {
      path: "./fonts/Montserrat.ttf",
    },
  ],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${montserrat.variable}`}>
        <div className="w-full bg-yellow-300 text-center py-2">
          <b>PROBÍHÁ TESTOVACÍ SPUŠTENÍ WEBOVÉ APLIKACE, NEJEDNÁ SE O PRODUKČNÍ SYSTÉM. DĚKUJEME ZA POCHOPENÍ.</b>
        </div>
        {children}
        <div className="absolute -z-10 top-0 w-full overflow-hidden py-24 sm:py-32 lg:px-0 h-dvh">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <svg
              aria-hidden="true"
              className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,background,transparent)]"
            >
              <defs>
                <pattern
                  x="50%"
                  y={-1}
                  id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                  width={200}
                  height={200}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                <path
                  d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
                width="100%"
                height="100%"
                strokeWidth={0}
              />
            </svg>
          </div>
        </div>
      </body>
    </html>
  );
}
