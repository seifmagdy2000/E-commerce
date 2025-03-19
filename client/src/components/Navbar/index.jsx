import React from "react";
import { Link } from "react-router-dom";
import DesktopNavbar from "./desktop/DesktopNavbar.jsx";


const classes = {
  commonLink: "flex items-center space-x-2 border-2 border-white rounded-2xl px-4 py-2 transition hover:bg-white hover:text-orange-500",
  header: "sticky top-0 left-0 w-full bg-orange-500 h-16 flex items-center px-6 shadow-lg z-50", 
};
function Navbar() {


  return (
    <header className={classes.header} id="header">
      <div className="max-w-8xl w-full flex justify-between items-center mx-auto">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          E-commerce
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-4 ">
          <DesktopNavbar/>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
