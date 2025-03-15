import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, UserPlus, LogIn, LogOut } from "lucide-react";
import MobileNavBar from "../mobile/MobileNavBar.jsx";

const cartItemCount = 3; // Hardcoded for now, later can be dynamic

const classes = {
  commonLink: "flex items-center space-x-2 border-2 border-white rounded-2xl px-4 py-2 transition hover:bg-white hover:text-orange-500",
  navContainer: "hidden md:flex items-center space-x-4",
};

function DesktopNavbar() {
  const user = true; // Change to false for testing
  const isAdmin = true; // Change to false if user isn't admin

  // Define navigation links
  const links = user
    ? [
        {
          to: "/cart",
          text: "Cart",
          icon: (
            <div className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            </div>
          ),
        },
        { to: "/logout", text: "Logout", icon: <LogOut size={20} /> },
        ...(isAdmin ? [{ to: "/dashboard", text: "Dashboard", icon: "" }] : []),
      ]
    : [
        { to: "/login", text: "Login", icon: <LogIn size={20} /> },
        { to: "/signup", text: "Sign Up", icon: <UserPlus size={20} /> },
      ];

  return (
    <header className="fixed top-0 left-0 w-full bg-orange-500 h-16 flex items-center px-6 shadow-lg z-50">
      <div className="max-w-8xl w-full flex justify-between items-center mx-auto">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          E-commerce
        </Link>

        {/* Desktop Navbar */}
        <nav className={classes.navContainer}>
          {links.map((link) => (
            <Link key={link.to} to={link.to} className={`text-white ${classes.commonLink}`}>
              <span>{link.text}</span> {link.icon}
            </Link>
          ))}
        </nav>

        {/* Mobile Burger Menu */}
        <MobileNavBar links={links} />
      </div>
    </header>
  );
}

export default DesktopNavbar;
