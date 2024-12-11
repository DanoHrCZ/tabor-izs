"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faBell,
  faUser,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons"; // Přidání ikony pro přihlášení
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase"; // Import Firebase konfigurace

const navigation = [
  { name: "Úvod", href: "/", current: false },
  { name: "Informace", href: "/information", current: false },
  { name: "Přihláška", href: "/offers", current: false },
  { name: "Galerie", href: "gallery", current: false },
  { name: "Sponzoři", href: "sponsors", current: false },
];

export default function Navbar() {
  const [navItems, setNavItems] = useState(navigation);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();
  const auth = getAuth();

  // Získání role uživatele z Firestore
  const getRole = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().role;
      }
      return null;
    } catch (error) {
      console.error("Chyba při načítání role:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRole = await getRole(currentUser.uid);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Chyba při odhlášení:", error);
    }
  };

  return (
    <nav className="bg-block sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  item.current
                    ? "bg-text-black text-background"
                    : "text-gray-300 hover:bg-gray-700 hover:text-background"
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
                  className="flex items-center space-x-2 text-gray-300 hover:text-background focus:outline-none"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5" />{" "}
                  {/* Ikona uživatele */}
                  <span>{user.displayName || "Uživatel"}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1">
                    <a
                      href={"/user/" + user.uid}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profil
                    </a>
                    {role === "admin" && (
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

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-background focus:outline-none focus:ring-2 focus:ring-background"
            >
              <FontAwesomeIcon
                icon={menuOpen ? faTimes : faBars}
                className="h-6 w-6"
              />
              <span className="sr-only">Otevřít menu</span>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden bg-gray-700 px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                item.current
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
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-500 hover:text-background"
              >
                Profil
              </a>
              {role === "admin" && (
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
