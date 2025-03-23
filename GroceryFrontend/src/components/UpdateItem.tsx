import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateItem: React.FC = () => {
  const [formData, setFormData] = useState({
    imageUrl: '',
    name: '',
    price: '',
    category: '',
    quantity: [{ value: '', unit: '' }],
  });
  const [itemId, setItemId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['Extra', 'Grains', 'Dairy & Bakery', 'Pulses', 'Snacks', 'Spices'];
  const units = ['kg', 'gm', 'L', 'ml', 'item'];

  // Fetch current item data when the itemId is set
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!itemId) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`/items/${itemId}`); // Replace with your API endpoint
        setFormData(response.data); // Assuming the API returns the item in the same format as formData
        setErrorMessage(null);
      } catch (err: any) {
        setErrorMessage(err.response?.data?.message || 'Error fetching item details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const { name, value } = e.target;

    if (name.startsWith('quantity')) {
      const field = name.split('.')[1];
      const updatedQuantity = [...formData.quantity];
      if (index !== undefined) updatedQuantity[index][field as keyof typeof updatedQuantity[0]] = value;
      setFormData({ ...formData, quantity: updatedQuantity });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addQuantityField = () => {
    setFormData({
      ...formData,
      quantity: [...formData.quantity, { value: '', unit: '' }],
    });
  };

  const removeQuantityField = (index: number) => {
    setFormData({
      ...formData,
      quantity: formData.quantity.filter((_, i) => i !== index),
    });
  };

  // Submit the updated form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await axios.put(
        '/updateItem',
        { ...formData },
        {
          headers: {
            id: 'yourUserId', // Replace with admin user ID
            itemid: itemId.trim(),
          },
        }
      );
      setSuccessMessage(response.data.message);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Error updating item');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Update Item</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-2">Item ID</label>
          <input
            type="text"
            name="itemId"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {isLoading ? (
          <p>Loading item details...</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block font-medium mb-2">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-lg p-2"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Quantity</label>
              {formData.quantity.map((qty, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="number"
                    name={`quantity.value`}
                    placeholder="Value"
                    value={qty.value}
                    onChange={(e) => handleInputChange(e, index)}
                    className="border-gray-300 rounded-lg p-2"
                  />
                  <select
                    name={`quantity.unit`}
                    value={qty.unit}
                    onChange={(e) => handleInputChange(e, index)}
                    className="border-gray-300 rounded-lg p-2"
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeQuantityField(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuantityField}
                className="text-blue-500"
              >
                Add Quantity Field
              </button>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Update Item
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default UpdateItem;
