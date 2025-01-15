import React from "react";
export default function Offers() {
  return (
    <div className=" py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center text-base/7 font-semibold text-text-indigo">
          představujeme vám
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-black tracking-tight text-text-black sm:text-5xl">
          Nový přehlednější systém přihlášek!
        </p>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-background lg:rounded-l-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-black max-lg:text-center">
                  Vytvořte si účet
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-text-secondary max-lg:text-center">
                  Z vašeho účtu budete moct spravovat vaše přihlášky a sledovat
                  jejich stav.
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
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-text-black shadow-2xl">
                  <img
                    className="size-full object-cover object-top"
                    src="/screen2.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
          </div>
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-background lg:rounded-r-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-black max-lg:text-center">
                  Jednoduše vyplňte prihlášku
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-text-secondary max-lg:text-center">
                  Prihlášku máte vyplňenou za pár minut. Následně jen zaplatíte
                  částku na účet, podle pokynů, a máte hotovo. <b>celková částka, za jedno díte je 9000kč. (4000kč záloha + 5000kč doplatek)</b>
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-text-black shadow-2xl">
                  <img
                    className="size-full object-cover object-top"
                    src="/screen1.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
          </div>
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-background lg:rounded-r-[2rem]"></div>
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-background lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-black max-lg:text-center">
                    Posílejte vašim dětem zprávy
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-text-secondary max-lg:text-center">
                    Na vašem účtu budete mít možnost posílat zprávy vašim dětem,
                    kdykoliv budete chtít. Tyto zprávy budete vidět pouze vy a
                    vašemu dítěti je vytiskneme a předáme.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-text-black shadow-2xl">
                    <p className="text-negative-color text-center p-16 font-bold text-lg">V tuto chvíli ve vývoji.</p>
                    {/* <img
                      className="size-full object-cover object-top"
                      src="/screen2.png"
                      alt=""
                    /> */}
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-pxshadow ring-1 ring-black/5"></div>
            </div>
            <div className="pointer-events-none absolute inset-px shadow ring-1 ring-black/5 lg:rounded-l-lg lg:rounded-r-[2rem]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
