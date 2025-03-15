import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";

const cartItemCount = 3; // Hardcoded for now, later can be dynamic

const classes = {
  commonLink:
    "flex items-center space-x-2 border-2 border-white rounded-2xl px-4 py-2 transition hover:bg-white hover:text-orange-500",
  navContainer: "flex items-center space-x-4",
};

function DesktopNavbar() {
  const user = true; // Change to false for testing
  const isAdmin = true; // Change to false if user isn't admin

  const links = user
    ? [
        {
          to: "/cart",
          text: "Cart",
          icon: (
            <div className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-3 bg-white text-orange-500 text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            </div>
          ),
        },
        { to: "/logout", text: "Logout", icon: <LogOut size={20} /> },
        ...(isAdmin ? [{ to: "/dashboard", text: "Dashboard", icon: <Lock size={20} />  }] : []),
      ]
    : [
        { to: "/login", text: "Login", icon: <LogIn size={20} /> },
        { to: "/signup", text: "Sign Up", icon: <UserPlus size={20} /> },
      ];

  return (
    <nav className={classes.navContainer}>
      {links.map((link) => (
        <Link key={link.to} to={link.to} className={`text-white ${classes.commonLink}`}>
          <span>{link.text}</span> {link.icon}
        </Link>
      ))}
    </nav>
  );
}

export default DesktopNavbar;
