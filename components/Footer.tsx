import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook as fabFacebook, faInstagram as fabInstagram } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-text-black text-background py-8">
            <div className="px-4">
                <div className="flex flex-col md:flex-row max-w-lg mx-auto justify-between text-center md:text-left mb-8">
                    <div className="mb-4 md:mb-0">
                        <p className="font-semibold">Email: <a href="mailto:taborizs@gmail.com" className="hover:underline">taborizs@seznam.cz</a></p>
                        <p className="font-semibold">Telefon: <a href="tel:+420777859730" className="hover:underline">+420 777 859 730</a></p>
                    </div>
                    <div className="mb-4 md:mb-0">
                        <p className="font-semibold">Číslo účtu: 2300799562/2010</p>
                        <p className="font-semibold">IČ: 943731</p>
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
                                <FontAwesomeIcon icon={fabFacebook as IconProp} size="2x" />
                            </a>
                            <a
                                href="https://instagram.com/taborizs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-background hover:text-gray-700 transition-colors w-16"
                                aria-label="Instagram"
                            >
                                <FontAwesomeIcon icon={fabInstagram as IconProp} size="2x" />
                            </a>
                        </div>
                    </div>
                    <div className="w-full flex items-center flex-col">
                        <span>©2024 Tábor IZS all rights reserved</span>
                        <span>Daniel Hrečin - DHDesigns</span>
                        <Image className="py-1 w-12" src="/logodhdesigns.png" alt="logo" width={48} height={48} />
                    </div>
                </div>
            </div>
        </footer>
    )
}