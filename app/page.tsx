import Links from "../components/Links";

export default function LandingPage() {
  return (
    <>
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
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
                <p className="text-base/7 font-semibold text-indigo-600">
                  Tábor Integrovaného záchranného systému 2024
                </p>
                <h1 className="mt-2 text-pretty text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                  Ahoj holky a kluci!
                </h1>
                <p className="mt-6 text-xl/8 text-gray-700">
                  Ti, kteří s námi již byli v minulých letech ví, že program na
                  letním dětském táboře IZS byl netradiční a velice akční.
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="/firemans.jpg"
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
                <p>
                  Zábavnou formou se zde totiž představují ty nejdůležitější
                  zaměstnání jako jsou policisté, hasiči, záchranáři apod. I
                  letos bude program nabitý aktivitami, ukázkami, dramatickými
                  situacemi a hlavně skvělou náladou! Takže, kdo chce vidět z
                  vnitřku sanitku, hasičský vůz, kdo chce vidět základy
                  sebeobrany, první pomoci, zásah speciálně trénovaných psů, ten
                  ať jede letos s námi – bude to skvěle strávených 13 dní!
                </p>
                <Links />
                <p className="">
                  Vytvořte si účet a následně zaregistrujte své dítě. Ke všem
                  informacím budete mít přístip zde na jednom.
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Vytvořit účet
                  </a>
                </div>
                <div className="lg:pr-4">
                  <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
                    <p>
                      Mimo klasických táborových aktivit, jako jsou sportovní
                      turnaje, hry, stopovaná, táborová diskotéka, výlety a
                      táboráky, bude program zaměřen především na práci složek
                      Integrovaného záchranného systému.
                    </p>
                    <ul role="list" className="mt-8 space-y-8 text-gray-600">
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Paintball – adrenalinové přestřelky
                          </strong>
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Lanové aktivity
                          </strong>{" "}
                          – slaňování, lanový traverz, různé prolézačky a dráhy
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Střelba
                          </strong>{" "}
                          + ukázky různých zbraní (akustické zbraně, vzduchovky,
                          malorážky, pistole, revolvery, poloautomatické pušky,
                          brokovnice,...)
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Čtyřkolky
                          </strong>{" "}
                          – praktická ukázka zásad bezpečnosti při jízdě a volba
                          prostor, kde jezdit a kde ne
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Dvoudenní přežití v přírodě
                          </strong>{" "}
                          – výlet do přírody se spaním v improvizovaných
                          podmínkách
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Dětské dopravní hřiště
                          </strong>{" "}
                          (BESIP)
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Recyklace a nakládání s odpady
                          </strong>{" "}
                          – přednáška se spoustou zábavných her a kvízů
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Airsoftová zábava
                          </strong>
                        </span>
                      </li>
                    </ul>
                    <p className="mt-6 text-xl/8 text-gray-700">
                      Z oblasti práce Zdravotnické záchranné služby
                    </p>
                    <ul role="list" className="mt-8 space-y-8 text-gray-600">
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Praktická bloková výuka první pomoci
                          </strong>{" "}
                          – v průběhu celého tábora se všemi potřebnými
                          pomůckami pod vedením instruktorů z řad zdravotníků a
                          profesionálních záchranářů
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Ukázka zásahu složek IZS
                          </strong>{" "}
                          – při simulované dopravní nehodě a ošetření zraněných
                          v terénu
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Seznámení se s činností Zdravotnické záchranné
                            služby
                          </strong>{" "}
                          – technikou a vybavením vozidel
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Hry a modelové situace
                          </strong>{" "}
                          – zaměřené na procvičení první pomoci v praxi
                        </span>
                      </li>
                    </ul>
                    <p className="mt-6 text-xl/8 text-gray-700">
                      Z oblasti práce Hasičského záchranného sboru
                    </p>
                    <ul role="list" className="mt-8 space-y-8 text-gray-600">
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Ukázka práce HZS
                          </strong>{" "}
                          – v reálných situacích (vyproštění osob z havarovaného
                          automobilu, požár automobilu, záchrana osob z výšek,
                          ...)
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Seznámení se s činností hasičů
                          </strong>{" "}
                          – a jejich vybavením
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Přednášky na téma chování při požárech
                          </strong>{" "}
                          – a jiných mimořádných událostech
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Využívání hasičské techniky
                          </strong>{" "}
                          – po celou dobu tábora (požární sport)
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Ukázka a vyzkoušení práce hasičů
                          </strong>{" "}
                          – rozstřihání auta, slaňování, jízda po ukloněném
                          lanovém traverzu
                        </span>
                      </li>
                    </ul>
                    <p className="mt-6 text-xl/8 text-gray-700">
                      Z oblasti činnosti Policie ČR a městské policie
                    </p>
                    <ul role="list" className="mt-8 space-y-8 text-gray-600">
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Ukázky práce jednotlivých složek Policie ČR
                          </strong>{" "}
                          – za přítomnosti jejich příslušníků (např. pořádková
                          jednotka - těžkooděnci, služba dopravní policie,
                          kriminální policie, služební psovodi aj.)
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Praktické ukázky od vedoucích z řad policistů
                          </strong>{" "}
                          – výuka sebeobrany, zadržování pachatelů, zajišťování
                          stop na místě činu a jiné aktivity
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Ukázka výzbroje a výstroje policie
                          </strong>{" "}
                          – včetně služebních automobilů a motocyklů
                        </span>
                      </li>
                    </ul>
                    <p className="mt-6 text-xl/8 text-gray-700">
                      Z oblasti práce Armády ČR
                    </p>
                    <ul role="list" className="mt-8 space-y-8 text-gray-600">
                      <li className="flex gap-x-3">
                        <span>
                          <strong className="font-semibold text-gray-900">
                            Ukázka práce AČR
                          </strong>{" "}
                          – a její techniky
                        </span>
                      </li>
                    </ul>
                    <p className="mt-6">
                      Veškerý výše zmiňovaný program si děti mohou vyzkoušet pod
                      odborným vedením profesionálů z řad složek Integrovaného
                      záchranného systému ČR.
                    </p>
                    <p className="mt-6">(změna programu vyhrazena)</p>
                    <p className="mt-6">
                      Hlavní myšlenkou letního dětského tábora s tématikou IZS
                      je prevence a zdůraznění nutnosti fungování IZS ve
                      společnosti.
                    </p>
                    <p className="mt-6">
                      Děti, jako jedna z nejrizikovějších skupin obyvatelstva,
                      budou mít možnost seznámit se s trestnou činností, která
                      může být jimi, či na nich páchána (např. užívání a
                      distribuce drog, šikana, krádeže a jiné násilné trestné
                      činy). Mimo jiné si děti osvojí poskytnutí první pomoci,
                      chování v krizových situacích a další důležité znalosti
                      pro život.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
