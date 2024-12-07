// Importujte potřebné moduly
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Links() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-base/7 font-semibold text-indigo-600">
        Sledujte nás na sociálních sítích
      </p>
      <div className="flex flex-row justify-around p-4 w-1/2">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 hover:text-gray-700 transition-colors w-16"
          aria-label="Facebook"
        >
          <FontAwesomeIcon icon={faFacebook} size="2x" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 hover:text-gray-700 transition-colors w-16"
          aria-label="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
      </div>
    </div>
  );
}
