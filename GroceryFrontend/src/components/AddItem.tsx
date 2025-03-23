import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";

// Define Zod schema for form validation
const itemSchema = z.object({
  imageUrl: z.string().url({ message: "Invalid URL format" }),
  name: z.string().min(1, { message: "Name is required" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  category: z.enum([
    "Extra",
    "Grains",
    "Dairy & Bakery",
    "Pulses",
    "Snacks",
    "Spices",
  ]),
  quantity: z
    .array(
      z.object({
        value: z.number().positive({ message: "Quantity must be positive" }),
        unit: z.enum(["kg", "gm", "L", "ml", "item"]),
      })
    )
    .nonempty({ message: "At least one quantity option is required" }),
});

const AddItem: React.FC = () => {
  const [formData, setFormData] = useState({
    imageUrl: "",
    name: "",
    price: "",
    category: "Extra",
    quantity: [{ value: "", unit: "kg" }],
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedQuantity = [...formData.quantity];
      if (name === "value") {
        updatedQuantity[index].value = value; // Use index to directly update value
      } else if (name === "unit") {
        updatedQuantity[index].unit = value; // Use index to directly update unit
      }
      setFormData({ ...formData, quantity: updatedQuantity });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Validate form data using Zod
      const validatedData = itemSchema.parse({
        ...formData,
        price: parseFloat(formData.price),
        quantity: formData.quantity.map((q) => ({
          value: parseFloat(q.value),
          unit: q.unit,
        })),
      });
      const headers = {
        userId: "6759c15b984c56a3dca11463",
        authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      };
    

      const response = await axios.post(
        "https://grocery-store-68wb.onrender.com/api/v1/item/addItem",
        validatedData, { headers} 
   
      );

      setSuccess(response.data.message);
      setFormData({
        imageUrl: "",
        name: "",
        price: "",
        category: "Extra",
        quantity: [{ value: "", unit: "kg" }],
      });
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Failed to add item");
      } else if (err.errors) {
        setError(err.errors.map((issue: any) => issue.message).join(", "));
      } else {
        setError(err.message || "An unknown error occurred");
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add Item</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="Extra">Extra</option>
            <option value="Grains">Grains</option>
            <option value="Dairy & Bakery">Dairy & Bakery</option>
            <option value="Pulses">Pulses</option>
            <option value="Snacks">Snacks</option>
            <option value="Spices">Spices</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Available Quantity
          </label>
          {formData.quantity.map((q, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="number"
                name="value" // Simplify to match the expected logic
                value={q.value}
                onChange={(e) => handleChange(e, index)}
                placeholder="Available Quantity"
                className="border p-2 w-full"
                required
              />
              <select
                name="unit" // Simplify to match the expected logic
                value={q.unit}
                onChange={(e) => handleChange(e, index)}
                className="border p-2"
              >
                <option value="kg">kg</option>
                <option value="gm">gm</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="item">item</option>
              </select>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItem;
