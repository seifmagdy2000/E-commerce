import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, UserPlus, LogIn, LogOut } from "lucide-react";

const classes = {
  commonLink:
    "flex items-center space-x-2 border-2 border-white rounded-2xl px-4 py-2 transition hover:bg-white hover:text-orange-500",
  navContainer: "flex items-center space-x-4",
};

function DesktopNavbar() {
  const user = true; // Change to false for testing logged-out state

  const links = [];

  if (!user) {
    links.push(
      <Link key="login" to="/login" className={`text-white ${classes.commonLink}`}>
        <span>Login</span> <LogIn size={20} />
      </Link>
    );

    links.push(
      <Link key="signup" to="/signup" className={`text-white ${classes.commonLink}`}>
        <span>Sign Up</span> <UserPlus size={20} />
      </Link>
    );
  } 
    links.push(
      <Link key="cart" to="/cart" className={`text-white ${classes.commonLink}`}>
        <span>Cart</span> <ShoppingCart size={20} />
      </Link>
    );

    links.push(
      <Link key="logout" to="/logout" className={`text-white ${classes.commonLink}`}>
        <span>Logout</span> <LogOut size={20} />
      </Link>
    );
  

  return <nav className={classes.navContainer}>{links}</nav>;
}

export default DesktopNavbar;
