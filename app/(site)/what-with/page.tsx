import React from "react";
import Image from 'next/image';
export default function InformationsPage() {
    return (
        <>
            <div className=" min-h-dvh relative isolate overflow-hidden bg-background px-6 py-12 sm:py-16 lg:overflow-visible lg:px-0">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="lg:max-w-lg">
                                <p className="text-base/7 font-semibold text-text-indigo">
                                    Tábor Integrovaného záchranného systému 2025
                                </p>
                                <h1 className="mt-2 text-pretty text-4xl font-black tracking-tight text-text-black sm:text-5xl">
                                    Co si vzít s sebou?
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
                            src="/picture3.jpg"
                            className="w-full max-w-none rounded-xl bg-text-black shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
                        />
                    </div>
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
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
                                        – né starší než 2 roky, formulář na vyžádání zašleme do
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
                                        – Najdete je po přihlášení na vašem profilu
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
