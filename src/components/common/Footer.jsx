const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm font-montserrat mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <p className="mb-1">
          Todos los derechos reservados &copy; {new Date().getFullYear()}
        </p>
        <p className="opacity-75">
          Prohibida su distribución y/o uso sin permiso.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
