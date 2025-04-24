import React from "react";
import Image from 'next/image';
export default function InformationsPage() {
  return (
    <>
      <div className=" min-h-dvh relative isolate overflow-hidden bg-background px-6 py-12 sm:py-16 lg:overflow-visible lg:px-0">
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
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base/7 font-semibold text-text-indigo">
                  Tábor Integrovaného záchranného systému 2025
                </p>
                <h1 className="mt-2 text-pretty text-4xl font-black tracking-tight text-text-black sm:text-5xl">
                  Informace pro rodiče
                </h1>
                <p className="mt-6 text-xl/8 text-gray-700">
                  Prosíme rodiče, aby si řádně přečetli informace na webových
                  stránkách.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <Image
              alt=""
              src="/car.jpg"
              className="w-full max-w-none rounded-xl bg-text-black shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
                <p>
                  V termínu od 13. 7. 2025 do 26. 7. 2025 se v rekreačním
                  středisku Melchiorova Huť u obce Úněšov uskuteční již 19.
                  ročník Letního dětského tábora s tématikou Integrovaného
                  záchranného systému ČR. Program tábora bude probíhat ve
                  spolupráci s Policií ČR, Městskou policií, Vojenskou policií,
                  Armádou ČR, Zdravotní záchrannou službou a také Hasičským
                  záchranným sborem. Tým instruktorů je tvořen odborníky z
                  jednotlivých spolupracujících složek - policisty, zdravotníky,
                  hasiči a s pedagogicky či jinak vysokoškolsky vzdělanými
                  osobami s dlouholetou praxí. Na základě tématiky tohoto letního
                  tábora a jeho zaměření je tábor určen dětem od 7 do 17 let.
                </p>
                <p className="">
                  Vytvořte si účet a následně zaregistrujte své dítě. Ke všem
                  informacím budete mít přístup zde na jednom místě.
                </p>
                <div className="mt-4">
                  <a
                    href="/register"
                    className="rounded-md bg-text-indigo px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-indigo"
                  >
                    Vytvořit účet
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
