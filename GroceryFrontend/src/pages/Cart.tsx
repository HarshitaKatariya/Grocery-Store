import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emptyCart from "../images/empty_cart.png";
import Spinner from "../components/Spinner";
interface CartItem {
  cartItemId: string;
  _id: string;
  item: {
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: {
    value: number;
    unit: string;
  };
}

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const headers = {
    userId: localStorage.getItem("id") || "",
    authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(
          "http://localhost:1000/api/v1/user/get-cart-items",
          { headers }
        );
        const cartData: CartItem[] = response.data.cartItems;

        setCart(cartData);

        const totalAmount = cartData.reduce((acc, item) => {
          const price = Number(item.item.price) || 0;
          const quantity = Number(item.quantity.value) || 0;
          return acc + price * quantity;
        }, 0);

        setTotal(totalAmount);
      } catch (e: any) {
        console.error("Error fetching cart:", e.response?.data || e.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (cartItemId: string) => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/user/remove-from-cart",
        null,
        { headers: { ...headers, cartItemId } }
      );

      // Update the cart state after removing the item
      setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
    } catch (error: any) {
      console.error("Error removing item from cart:", error.response?.data || error.message);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/order/place-order",
        {},
        { headers }
        
      );
      
      if (response.data.status === "Success") {
        setCart([]);
        setTotal(0);
        // navigate(`/order-confirmation/${response.data.orderId}`);
      }
    } catch (error: any) {
      console.error("Error placing order:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-600">
            Your Cart is Empty
          </h1>
          <img src={emptyCart} alt="Empty Cart" className="mt-6 w-64 lg:w-96" />
        </div>
      ) : (
        <div className="min-h-screen p-6 bg-gray-50">
          <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>
          <div className="space-y-4">
            {cart.map((cartItem) => (
              <div
                key={cartItem._id}
                className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={cartItem.item.imageUrl}
                    alt={cartItem.item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {cartItem.item.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {cartItem.quantity.value} {cartItem.quantity.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-lg font-bold text-green-600">
                    ${cartItem.item.price * cartItem.quantity.value}
                  </p>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleRemove(cartItem.cartItemId)}
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-lg flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Total:</h2>
            <p className="text-2xl font-bold text-green-700">
              ${total.toFixed(2)}
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handlePlaceOrder}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
