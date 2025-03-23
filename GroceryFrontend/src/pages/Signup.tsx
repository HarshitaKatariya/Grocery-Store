import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Signup() {
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

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
  
    if (!value.username || !value.email || !value.password || !value.address) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      const response = await axios.post(
        "https://grocery-store-68wb.onrender.com/api/v1/user/signup",
        value,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      alert(response.data.message);
      navigate('/signin')
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
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Sign Up</h2>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <div>
            <label htmlFor="username" className="block text-gray-600 mb-1">Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={value.username}
              onChange={change}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={value.email}
              onChange={change}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 mb-1">Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={value.password}
              onChange={change}
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-600 mb-1">Address:</label>
            <textarea
              name="address"
              placeholder="Address"
              className="border border-gray-300 rounded-md px-3 py-2 w-full resize-none"
              rows={3}
              value={value.address}
              onChange={change}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-all"
          >
            Sign Up
          </button>
          <div className="mt-4 flex items-center justify-center">
            <span className="text-gray-600 font-semibold">Or</span>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <span className="text-gray-600 font-semibold">Already have an account?</span>
            <NavLink to="/signin" className="ml-2 text-green-500 font-semibold">Sign in</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
