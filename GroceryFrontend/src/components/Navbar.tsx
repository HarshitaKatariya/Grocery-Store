import  { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Navlink from "./Navlink";
import Brand from "./Brand";
import NavBtn from "./NavBtn";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8">
        {/* Brand/Logo */}
        <Brand />

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-full justify-between items-center space-x-4">
          {/* Center the Navlink and NavBtn */}
          <div className="flex-grow flex justify-center">
            <Navlink />
          </div>
          <div className="ml-4">
            <NavBtn />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleNavbar} className="text-gray-600">
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="flex flex-col items-center bg-white py-4 space-y-4 md:hidden">
          <Navlink />
          <div className="mt-4">
            <NavBtn />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
