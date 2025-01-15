"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUser,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons"; // Přidání ikony pro přihlášení
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase"; // Import Firebase konfigurace
import Image from 'next/image';

const navigation = [
  { name: "Úvod", href: "/", current: false },
  { name: "Informace", href: "/information", current: false },
  { name: "Co s sebou?", href: "/what-with", current: false },
  { name: "Přihláška", href: "/offers", current: false },
  // { name: "Galerie", href: "gallery", current: false },
  // { name: "Sponzoři", href: "sponsors", current: false },
];

export default function Navbar() {
  const [navItems, setNavItems] = useState(navigation);
  const [menuOpen, setMenuOpen] = useState({ navMenu: false, userMenu: false });
  const [user, setUser] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();
  const auth = getAuth();

  // Získání role uživatele z Firestore
  const getUser = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error("Chyba při načítání uživatele:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const user = await getUser(currentUser.uid);
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setNavItems((prevItems) =>
      prevItems.map((item) => ({ ...item, current: item.href === currentPath }))
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Chyba při odhlášení:", error);
    }
  };

  const handleUserIconClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      setMenuOpen((prev) => ({ ...prev, userMenu: !prev.userMenu }));
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 text-gray-300 ${scrollPosition > 0 ? 'bg-[#00000010] text-text-black backdrop-blur-md' : 'bg-text-black'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={50}
              className="w-10"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${item.current
                  ? `bg-text-black text-background ${scrollPosition > 0 ? 'bg-text-indigo' : ''}`
                  : "hover:bg-gray-700 hover:text-background"
                  }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Notification and User Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 hover:text-background focus:outline-none"
                  onClick={handleUserIconClick}
                >
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5" />{" "}
                  <span>{user.firstName}</span>
                </button>
                {menuOpen.userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1">
                    <a
                      href={"/user/" + (auth.currentUser ? auth.currentUser.uid : "")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profil
                    </a>
                    {user && user.role === "admin" && (
                      <a
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Administrace
                      </a>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Odhlásit se
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center text-gray-300 hover:text-background"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-5 w-5" />{" "}
                {/* Ikona pro přihlášení */}
                Přihlásit se
              </button>
            )}
          </div>

          {/* Mobile Menu Button and User Icon */}
          <div className="sm:hidden flex items-center space-x-4">
            <div className="relative">
              <button
                className="p-2 rounded-md text-gray-400 hover:text-background focus:outline-none focus:ring-2 focus:ring-background"
                onClick={handleUserIconClick}
              >
                <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
                <span className="sr-only">Profil</span>
              </button>
              {user && menuOpen.userMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1">
                  <a
                    href={"/user/" + auth.currentUser.uid}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profil
                  </a>
                  {user.role === "admin" && (
                    <a
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Administrace
                    </a>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Odhlásit se
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setMenuOpen((prev) => ({ ...prev, navMenu: !prev.navMenu }))}
              className="p-2 rounded-md text-gray-400 hover:text-background focus:outline-none focus:ring-2 focus:ring-background"
            >
              <FontAwesomeIcon
                icon={menuOpen.navMenu ? faTimes : faBars}
                className="h-6 w-6"
              />
              <span className="sr-only">Otevřít menu</span>
            </button>
          </div>
        </div>
      </div>

      {menuOpen.navMenu && (
        <div className="sm:hidden bg-gray-700 px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${item.current
                ? "bg-text-black text-background"
                : "text-gray-300 hover:bg-gray-500 hover:text-background"
                }`}
            >
              {item.name}
            </a>
          ))}
          {user && (
            <div>
              <a
                href={"/user/" + auth.currentUser.uid}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-500 hover:text-background"
              >
                Profil
              </a>
              {user.role === "admin" && (
                <a
                  href="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-500 hover:text-background"
                >
                  Administrace
                </a>
              )}
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-500 hover:text-background"
              >
                Odhlásit se
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}