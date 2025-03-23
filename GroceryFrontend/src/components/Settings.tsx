import { useState } from "react";
import { z } from "zod";
import axios from "axios";

const updateProfileSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters long"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  address: z.string().nonempty("Address is required"),
});

const Settings = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    // Validate input with zod
    const result = updateProfileSchema.safeParse(formData);
    if (!result.success) {
      const zodErrors = result.error.flatten().fieldErrors;
      setErrors(zodErrors);
      return;
    }

    // Call the API to update the profile
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        id: localStorage.getItem("id"),
      };
      const response = await axios.put(
        "https://grocery-store-68wb.onrender.com/api/v1/user/update",
        formData,
        { headers }
      );
      setSuccessMessage(response.data.message || "Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error.response?.data || error.message);
      setErrors({ server: error.response?.data?.error || "Something went wrong!" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Profile</h2>
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Update Profile
            </button>
          </div>
          {errors.server && (
            <p className="text-red-500 text-sm mt-2 text-center">{errors.server}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Settings;
