import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const classes = {
  menuButton: "text-white focus:outline-none",
  overlay: "fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-300",
  menuContainer:
    "fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300",
  closeButton: "flex justify-end p-4",
  navContainer: "flex flex-col space-y-4 p-6",
  navLink:
    "text-gray-800 text-lg font-medium flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition",
};

const MobileNavbar = ({ links }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);``

  return (
    <div className="md:hidden">
      {/* Burger Menu Button */}
      <button
        className={classes.menuButton}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Pre-rendered menu with visibility toggling */}
      <div className="relative">
        {/* Background Overlay */}
        <div
          className={`${classes.overlay} ${menuOpen ? "opacity-50 visible" : "opacity-0 invisible"}`}
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Sliding Mobile Menu */}
        <div
          className={`${classes.menuContainer} ${
            menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 invisible"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside menu from closing it
        >
          {/* Close Button */}
          <div className={classes.closeButton}>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={28} className="text-gray-700" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className={classes.navContainer} role="navigation">
            {links.map(({ to, text, icon }) => (
              <Link
                key={to}
                to={to}
                className={classes.navLink}
                onClick={() => setMenuOpen(false)}
              >
                {icon} <span>{text}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
