import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { authActions } from "../store/auth";
import { useDispatch } from "react-redux";

function Signin() {
  const [value, setValue] = useState({
    
    email: "",
    password: "",
   
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Request Payload:", value);
  
    if (!value.email || !value.password) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/user/signin",
        value,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.user.role));

      console.log(response.data.user.id);  
      localStorage.setItem('id',response.data.user.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role",response.data.user.role);
      alert(response.data.message);

      //navigate....
       navigate('/profile')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message);
      } else {
        alert("Unexpected Error:");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="border rounded-lg shadow-md p-6 bg-white w-full md:w-3/6 lg:w-2/6">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Sign In</h2>
        <form className="flex flex-col gap-4">
       

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              aria-label="Email"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={value.email}
              onChange={change}

            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-600 mb-1">
              Password:
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={value.password}
              onChange={change}

            />
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-all"
              onClick={submit}

            >
              Sign In
            </button>

            {/* Divider */}
            <div className="mt-4 flex items-center justify-center">
              <span className="text-gray-600 font-semibold">Or</span>
            </div>

            {/* Link to Signin */}
            <div className="mt-4 flex items-center justify-center">
              <span className="text-gray-600 font-semibold">Don't have an account?</span>
              <NavLink
                to="/signup"
                className="ml-2 text-green-500 hover:text-green-600 font-semibold transition-all"
                aria-label="Signin"
              >
                Sign up
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
