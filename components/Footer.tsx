import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <footer className="bg-text-black text-background py-8">
            <div className="px-4">
                <div className="mb-4 md:mb-0 flex justify-center py-4">
                    <ul className="space-y-2 md:space-y-0 md:space-x-4">
                        <li className="inline-block"><a href="/" className="hover:underline">Úvod</a></li>
                        <li className="inline-block"><a href="/information" className="hover:underline">Informace</a></li>
                        <li className="inline-block"><a href="/offers" className="hover:underline">Přihláška</a></li>
                        <li className="inline-block"><a href="/gallery" className="hover:underline">Galerie</a></li>
                        <li className="inline-block"><a href="/sponsors" className="hover:underline">Sponzoři</a></li>
                    </ul>
                </div>
                <div className="flex flex-col md:flex-row max-w-lg mx-auto justify-between text-center md:text-left mb-8">
                    <div className="mb-4 md:mb-0">
                        <p className="font-semibold">Email: <a href="mailto:info@tabor-izs.cz" className="hover:underline">info@tabor-izs.cz</a></p>
                        <p className="font-semibold">Telefon: <a href="tel:+420123456789" className="hover:underline">+420 123 456 789</a></p>
                    </div>
                    <div className="mb-4 md:mb-0">
                        <p className="font-semibold">Číslo účtu: 123456789/0100</p>
                        <p className="font-semibold">IČ: 12345678</p>
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col items-center">
                        <p className="text-base/7 font-semibold text-backgound">
                            Sledujte nás na sociálních sítích
                        </p>
                        <div className="flex flex-row justify-around p-4 w-1/4">
                            <a
                                href="https://www.facebook.com/taborizs.cz/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-background hover:text-gray-700 transition-colors w-16"
                                aria-label="Facebook"
                            >
                                <FontAwesomeIcon icon={faFacebook} size="2x" />
                            </a>
                            <a
                                href="https://instagram.com/taborizs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-background hover:text-gray-700 transition-colors w-16"
                                aria-label="Instagram"
                            >
                                <FontAwesomeIcon icon={faInstagram} size="2x" />
                            </a>
                        </div>
                    </div>
                    <div className="w-full flex items-center flex-col">
                        <span>©2024 Tábor IZS all rights reserved</span>
                        <span>Daniel Hrečin - DHDesigns</span>
                        <img className="py-1 w-12" src="/logodhdesigns.png" alt="logo" />
                    </div>
                </div>
            </div>
        </footer>
    )
}