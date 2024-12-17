import React from "react";
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
                  Tábor Integrovaného záchranného systému 2024
                </p>
                <h1 className="mt-2 text-pretty text-4xl font-black tracking-tight text-text-black sm:text-5xl">
                  Informace pro rodiče
                </h1>
                <p className="mt-6 text-xl/8 text-gray-700">
                  Prosíme rodiče, aby si řádně přečetli infomrace na wbových
                  stránkách.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="/car.jpg"
              className="w-[48rem] max-w-none rounded-xl bg-text-black shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
                <p>
                  V termínu od 14 7. 2024 do 27. 7. 2024 se v rekreačním
                  středisku Melchiorova Huť u obce Úněšov uskuteční již 18.
                  ročník Letního dětského tábora s tématikou Integrovaného
                  záchranného systému ČR. Program tábora bude probíhat ve
                  spolupráci s Policií ČR, Městskou policií, Vojenskou policií,
                  Armádou ČR, Zdravotní záchrannou službou a také Hasičským
                  záchranným sborem. Tým instruktorů je tvořen odborníky z
                  jednotlivých spolupracujících složek - policisty, zdravotníky,
                  hasiči a s pedagogicky či jinak vysokoškolsky vzdělanými
                  osobami s dlouholetou praxí.Na základě tématiky tohoto letního
                  tábora a jeho zaměření je tábor určen dětem od 7 do 17 let.
                </p>
                <p className="">
                  Vytvořte si účet a následně zaregistrujte své dítě. Ke všem
                  informacím budete mít přístip zde na jednom.
                </p>
                <div className="mt-4">
                  <a
                    href="/register"
                    className="rounded-md bg-text-indigo px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-indigo"
                  >
                    Vytvořit účet
                  </a>
                </div>

                <p className="mt-6 text-xl/8 text-gray-700">
                  Co si vzít s sebou?
                </p>
                <p className="my-4">
                  U malých dětí doporučujeme sepsat seznam sbalených věcí a
                  krátký popis pro případ pomíchání s věcmi jiných dětí.
                </p>
                <p className="my-4">
                  Co je možné podepsat - podepište(čepice, mikiny, bundy,
                  karimatky...)
                </p>
                <ul role="list" className="mt-8 space-y-8 text-text-secondary">
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Povlečení na jednolůžko
                      </strong>{" "}
                      – napínací prostěradlo, povlečení na deku a polštář
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Respirátory
                      </strong>{" "}
                      – na dobu pobytu (pokud nebudou nezbytně nutné, nebudeme
                      děti nutit do nošení respirátorů, jde o počítání s
                      možností nařízení ze strany vlády...)
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Spací pytel
                      </strong>{" "}
                      + karimatka – nutné pro přespání mimo tábor
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Celta nebo plachta malá
                      </strong>{" "}
                      – cca 2x2m, pro přikrytí při táboření pod širým nebem
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Pláštěnka a gumovky
                      </strong>{" "}
                      – nezbytné pro špatné počasí
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Pokrývka hlavy
                      </strong>{" "}
                      – nejlépe kšiltovka
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Batoh na výlety
                      </strong>{" "}
                      – středně velký (ne taška přes rameno ani igelitka)
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Jídelní souprava
                      </strong>{" "}
                      – ešus, hrnek a lžíce, nutné pro stravování mimo tábor
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Malý zavírací nůž
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Baterka
                      </strong>{" "}
                      (popř. náhradní baterie) nebo čelovka
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Psací potřeby
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Poštovní známky, dopisní papíry, pohledy
                      </strong>{" "}
                      – možno zakoupit v areálu tábora
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Pytel na špinavé prádlo
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Prostředky pro osobní a intimní hygienu
                      </strong>{" "}
                      – kartáček, pasta, šampon, mýdlo, hřeben, ručníky
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Starší šátek
                      </strong>{" "}
                      – na hru
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Plavky a ručník
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Sluneční brýle
                      </strong>{" "}
                      a popř. opalovací krém, repelent
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Toaletní papír
                      </strong>{" "}
                      a papírové kapesníčky
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Spodní prádlo
                      </strong>{" "}
                      na každý den, ponožky, podkolenky, pro menší děti i
                      punčocháče
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Trička
                      </strong>{" "}
                      s krátkým i dlouhým rukávem
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Teplý svetr
                      </strong>
                      , mikina, rolák
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Kalhoty
                      </strong>
                      , kraťasy, tepláky, šusťáky (ze zkušeností víme, že jich
                      mají děti vždy nedostatek)
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Teplejší bunda
                      </strong>{" "}
                      a šusťákovka
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Tepláková souprava
                      </strong>
                      , něco na spaní (pyžamo)
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Sportovní obuv
                      </strong>
                      , pevná turistická obuv, letní vzdušná obuv, obuv do vody
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Utěrka pro vlastní potřebu
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Šicí potřeby
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-text-black">
                        Malé kapesné
                      </strong>{" "}
                      – cca 400,- Kč, dle uvážení rodičů (v areálu je možné si
                      zakoupit sladkosti apod.)
                    </span>
                  </li>
                </ul>
              </div>
              <p className="my-4">
                Berte prosím ohled na to, že děti se často namočí apod., a pak
                jim nezbývají suché věci, proto radši přibalte např. o jedny
                tepláky, boty navíc, než aby potom dítě nemělo v čem chodit.
              </p>
              <p className="my-4">
                V průběhu tábora mají účastníci možnost uložit peníze u vedení
                tábora. Provozovatel tábora neručí za ztráty neuložené
                hotovosti.
              </p>
              <p className="mt-6 text-xl/8 text-gray-700">Co určitě nebrat?</p>
              <ul role="list" className="mt-8 space-y-8 text-text-secondary">
                <li className="flex gap-x-3">
                  <span>
                    <strong className="font-semibold text-text-black">
                      Mobilní telefony
                    </strong>&quot;
                    – jsou hrubým porušením řádu tábora (více viz &quot;Informace pro
                    rodiče&quot;)
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span>
                    <strong className="font-semibold text-text-black">
                      Elektronické hry
                    </strong>
                    , iPod, tablety, MP3, DVD
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span>
                    <strong className="font-semibold text-text-black">
                      Drahé oblečení a cenné předměty
                    </strong>
                    , velké peněžní částky
                  </span>
                </li>
              </ul>
              <p className="my-4">
                Všechny tyto věci jen na vlastní nebezpečí odcizení nebo ztráty.
                Za uvedené předměty nemůžeme nést odpovědnost.
              </p>
              <p className="mt-6 text-xl/8 text-gray-700">Při předání dítěte na tábor odevzdáte</p>
              <ul role="list" className="mt-8 space-y-8 text-text-secondary">
                <li className="flex gap-x-3">
                  <span>
                    <strong className="font-semibold text-text-black">
                      Očkovací průkaz
                    </strong>{" "}
                    – stačí kopie
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span>
                    <strong className="font-semibold text-text-black">
                      Kartička pojištěnce
                    </strong>{" "}
                    – stačí kopie
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span>
                    <strong className="font-semibold text-text-black">
                      Lékařské potvrzení
                    </strong>{" "}
                    – né starší než 1 rok, formulář na vyžádání zašleme do
                    emailu
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span>
                    <strong className="font-semibold text-text-black">
                      Nástupní list
                    </strong>{" "}
                    – řádně vyplněný a podepsaný v den odjezdu
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span>
                    <strong className="font-semibold text-text-black">
                      Dokumenty
                    </strong>{" "}
                    – zaslané po vyplnění elektronické přihlášky na Váš e-mail
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span>
                    <strong className="font-semibold text-text-black">
                      Léky
                    </strong>{" "}
                    – pokud dítě nějaké bere, spolu s písemným předpisem jejich
                    užívání (léky musí být podepsané)
                  </span>
                </li>
              </ul>

              <p className="my-4">
                Velmi doporučujeme malým dětem věci podepsat či viditelně
                označit. Pro lepší přepravu doporučujeme umístit věci spíše do
                kufru než do neskladných batohů a tašek. Navíc dejte dítěti
                přiměřeně velký batoh na výlety - aby se do batohu vešlo alespoň
                pití, ešus a dal se zavěsit spacák s karimatkou.
              </p>

              <p className="my-4">
                Pokud vaše dítě hraje na nějaký hudební nástroj, který je lehce
                přepravitelný, ať si ho vezme s sebou, pomůže nám tak zpříjemnit
                atmosféru táborových ohňů.
              </p>

              <p className="my-4">
                Vybavení dítěte na tábor s ohledem na pobyt v přírodě.
                Doporučujeme využít především starší oděvy a počítat s případnou
                možností jejich poničení. Obuv, kterou si dítě na tábor přiveze,
                by měla být pohodlná, doporučujeme nevybavovat dítě novou obuví
                (především turistickou - kvůli puchýřům a nevyšlapání bot) a
                před odjezdem na tábor překontrolovat, zda velikost obuvi
                odpovídá potřebám dítěte.
              </p>

              <p className="my-4">
                Znovu upozorňujeme na nevhodnost cenností, jako jsou například
                drahé šperky a elektronika. Organizátor ani provozovatel tábora
                neručí za jejich případná poškození a ztráty.
              </p>

              <p className="my-4">
                Dále pak znova na nevhodnost návštěvy rodičů a ostatních
                příbuzných, s ohledem na stavbu programu, zkušenosti z
                předešlých akcí a z hygienických důvodů!!! Zvláště u malých dětí
                to velmi narušuje proces asimilace nejen Vašeho dítěte, ale i
                těch ostatních.
              </p>

              <p className="my-4">
                Při jakémkoliv problému vás budeme okamžitě telefonicky
                informovat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
