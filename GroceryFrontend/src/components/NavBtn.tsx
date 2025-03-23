import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBtn = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Access the `isLoggedIn` value from Redux store
  const isLoggedIn = useSelector((state:any) => state.auth.isLoggedIn);
  const role = useSelector((state:any) => state.auth.role);
  () => {
    setIsSearchOpen(!isSearchOpen);
  };
 

  return (
    <div className="flex items-center space-x-4">
      {/* Search Icon */}
      {/* <FontAwesomeIcon
        icon={faSearch}
        className="text-gray-500 text-xl hover:text-green-800 cursor-pointer"
        onClick={toggleSearch}
      />

     
      {isSearchOpen && (
        <div className="flex flex-col space-y-2 items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-2 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 md:w-72"
          />
          <NavLink
            to="search"
            className="text-white bg-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-700"
          >
            Search
          </NavLink>
        </div>
      )} */}
      
      {/* SignIn and SignUp Buttons */}
      {!isLoggedIn && (<>
        <NavLink
        to="/signin"
        className="text-white bg-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-700"
      >
        SignIn
      </NavLink>
      <NavLink
        to="/signup"
        className="text-white bg-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-700"
      >
        SignUp
      </NavLink>
      </>)}

      {/* Conditional Rendering for Cart and Profile */}
      {isLoggedIn && role === 'user' && (
        <>
          <NavLink 
            to="/cart"
            className="text-white bg-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-700"
          >
            Cart
          </NavLink>
          <NavLink
            to="/profile"
            className="text-white bg-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-700"
          >
            Profile
          </NavLink>
        </>
      )}
         {isLoggedIn && role === 'admin' && (    
          <>
          <NavLink 
            to="/profile"
            className="text-white bg-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-700"
          >
            Admin Profile
          </NavLink>
          </>
         )}      
    </div>
  );
};

export default NavBtn;
