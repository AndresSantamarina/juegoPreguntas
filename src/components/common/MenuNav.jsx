import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const MenuNav = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = user ? (
    <>
      <Link
        to="/"
        onClick={closeMenu}
        className="hover:text-blue-500 transition-colors py-2 px-3"
      >
        INICIO
      </Link>
      <Link
        to="/impostor"
        onClick={closeMenu}
        className="hover:text-blue-500 transition-colors py-2 px-3"
      >
        IMPOSTOR
      </Link>
      <Link
        to="/agregar"
        onClick={closeMenu}
        className="hover:text-blue-500 transition-colors py-2 px-3"
      >
        AGREGAR
      </Link>
      <Link
        to="/preguntas"
        onClick={closeMenu}
        className="hover:text-blue-500 transition-colors py-2 px-3"
      >
        MODIFICAR
      </Link>
      <Link
        to="/jugar"
        onClick={closeMenu}
        className="hover:text-blue-500 transition-colors py-2 px-3"
      >
        JUGAR
      </Link>
      <Link
        to="/ruleta"
        onClick={closeMenu}
        className="hover:text-blue-500 transition-colors py-2 px-3"
      >
        RULETA
      </Link>{" "}
      <button
        onClick={() => {
          logout();
          closeMenu();
        }}
        className="text-left text-red-500 hover:text-red-700 transition-colors py-2 px-3 font-bold"
      >
        CERRAR SESIÓN
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        onClick={closeMenu}
        className="hover:text-blue-500 transition-colors py-2 px-3"
      >
        INICIAR SESIÓN
      </Link>
      <Link
        to="/register"
        onClick={closeMenu}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-center"
      >
        REGISTRARSE
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-md font-montserrat sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 tracking-tight"
            >
              Juego de Preguntas
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-2 font-semibold text-sm text-gray-600">
            {navLinks}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="flex flex-col px-4 pt-2 pb-4 space-y-2 font-semibold text-gray-600">
              {navLinks}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MenuNav;
