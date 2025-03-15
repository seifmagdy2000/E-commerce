import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const MobileNavbar = ({ links }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Burger Menu Button */}
      <button
        className="text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Background overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sliding Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-50 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)}>
            <X size={28} className="text-gray-700" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 p-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-800 text-lg font-medium flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} <span>{link.text}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNavbar;
