import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInr } from "@fortawesome/free-solid-svg-icons";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

interface Quantity {
  value: number;
  unit: string;
}

interface Item {
  imageUrl: string;
  name: string;
  price: number;
  category: string;
  quantity: Quantity[];
}

const GetItem = () => {
  const { id } = useParams<{ id: string }>(); // Get the item ID from the URL
  const [item, setItem] = useState<Item | null>(null); // State for a single item
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1); // State for user-selected quantity

  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const role = useSelector((state: any) => state.auth.role);

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get<{ item: Item }>(
          `https://grocery-store-68wb.onrender.com/api/v1/item/get-item/${id}`
        );
        setItem(res.data.item); // Assuming API returns a single "item" property
      } catch (err) {
        console.error("Error fetching item:", err);
        setErrorMessage("Failed to load the item. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleDelete = async () => {
    const headers = {
      userId: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
      itemId: id,
    };
    // console.log(headers.itemId);


    const response = await axios.delete(
      "https://grocery-store-68wb.onrender.com/api/v1/item/deleteItem",
      { headers }
    );
    if (response.status === 200) {
      console.log("Item deleted successfully");
    } else {
      console.log("Error deleting item");
    }
  };

  const handleCart = async () => {
    try {
      const headers = {
        userId: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        itemId: id,
      };

      const body = {
        quantity: selectedQuantity,
        unit: item?.quantity[0].unit,
      };

      const response = await axios.put(
        "https://grocery-store-68wb.onrender.com/api/v1/user/add-to-cart",
        body,
        { headers }
      );

      console.log(response.data);

      alert("Item added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  // Handle quantity change (for dropdown)
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuantity(parseInt(e.target.value, 10));
  };

  // Render the component
  return (
    <div className="p-4 flex flex-col md:flex-row gap-8">
      {loading ? (
        <div className="flex justify-center text-center w-full">
          <Spinner />
        </div>
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : item ? (
        <>
          {/* Image Section */}
          <div className="border w-full md:w-1/2 rounded-lg h-72 md:h-[80vh] shadow-md p-4 flex justify-center items-center hover:shadow-lg hover:bg-gray-200 transition-all duration-300 ease-in-out">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover rounded"
            />
          </div>

          {/* Details Section */}
          <div className="p-4 w-full md:w-1/2 flex flex-col gap-4">
            <h1 className="text-xl md:text-2xl font-bold">{item.name}</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Category: {item.category}
            </p>
            <p className="text-blue-500 text-lg md:text-xl font-semibold">
              Price: <FontAwesomeIcon icon={faInr} /> {item.price}
            </p>

            {/* Quantity Dropdown and Add to Cart for Logged-in Users */}
            {isLoggedIn &&
              role === "user" &&
              item.quantity &&
              item.quantity.length > 0 && (
                <>
                  <p className="text-gray-500 text-sm md:text-base">
                    Available Quantity: {item.quantity[0].value}{" "}
                    {item.quantity[0].unit}
                  </p>
                  <label
                    htmlFor="quantity-select"
                    className="text-gray-700 font-medium"
                  >
                    Select Quantity to Buy:
                  </label>
                  <select
                    id="quantity-select"
                    value={selectedQuantity}
                    onChange={handleQuantityChange}
                    className="border rounded px-2 py-1 text-gray-700"
                  >
                    {Array.from(
                      { length: item.quantity[0].value }, // Create options based on available quantity
                      (_, i) => i + 1 // Values from 1 to max quantity
                    ).map((value) => (
                      <option key={value} value={value}>
                        {value} {item.quantity[0].unit}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-green-600">
                    You want to buy: {selectedQuantity} {item.quantity[0].unit}
                  </p>

                  {/* Add to Cart Button */}
                  <NavLink
                    to=""
                    className="inline-flex items-center justify-center text-white bg-green-600 px-4 py-2 rounded-md text-lg hover:bg-green-700 transition duration-200 ease-in-out"
                    onClick={handleCart}
                  >
                    Add to Cart <FaShoppingCart className="ml-2" />
                  </NavLink>
                </>
              )}

            {isLoggedIn &&
              role === "admin" &&
              item.quantity &&
              item.quantity.length > 0 && (
                <>
                  {/* <NavLink
                    to= {`/update-item/${id}`}
                    className="inline-flex items-center justify-center text-white bg-green-600 px-4 py-2 rounded-md text-lg hover:bg-green-700 transition duration-200 ease-in-out"
                  >
                    Edit Item <FaRegEdit className="ml-2" />
                  </NavLink> */}

                  {/* Add to Cart Button */}
                  <NavLink
                    to="/products"
                    className="inline-flex items-center justify-center text-white bg-green-600 px-4 py-2 rounded-md text-lg hover:bg-green-700 transition duration-200 ease-in-out"
                    onClick={handleDelete}
                  >
                    Delet Item <MdDelete className="ml-2" />
                  </NavLink>
                </>
              )}
          </div>
        </>
      ) : (
        <p>No item found.</p>
      )}
    </div>
  );
};

export default GetItem;
