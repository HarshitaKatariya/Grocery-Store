
import { NavLink } from "react-router-dom";



const Navlink = () => {
  return (
    <div>
      <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-lg md:text-xl font-medium ">
        {/* Home link */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `relative group hover:text-green-800 ${
              isActive ? "text-green-700" : "text-gray-700"
            }`
          }
        >
          Home
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
        </NavLink>

        {/* Products link */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `relative group hover:text-green-800 ${
              isActive ? "text-green-700" : "text-gray-700"
            }`
          }
        >
          Products
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
        </NavLink>

        {/* Contact link */}
        {/* <NavLink
          to="/contact"
          className={({ isActive }) =>
            `relative group hover:text-green-800 ${
              isActive ? "text-green-700" : "text-gray-700"
            }`
          }
        >
          Contact
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
        </NavLink> */}

        {/* About link */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `relative group hover:text-green-800 ${
              isActive ? "text-green-700" : "text-gray-700"
            }`
          }
        >
          About
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
        </NavLink>
        
      </nav>
    </div>
  );
};

export default Navlink;
 