import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

interface OrderItem {
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: { value: number; unit: string };
}

interface Order {
  orderId: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://grocery-store-68wb.onrender.com/api/v1/order/order-history",
          {
            headers: {
              userId: localStorage.getItem("id") || "",
              authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
        setOrders(response.data.orders || []);
      } catch (error: any) {
        console.error("Error fetching order history:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow py-6 px-4 sm:px-8">
        <h2 className="text-xl sm:text-2xl flex justify-center font-semibold text-gray-800 p-2">
          Your Order History
        </h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-gray-200"
              >
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium">{order.status}</span> | Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4 space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-100 p-4 rounded-lg"
                      >
                        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                          <img
                            src={item.imageUrl || "https://via.placeholder.com/150"}
                            alt={item.name || "Unnamed Item"}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-lg font-semibold">{item.name || "Unnamed Item"}</h3>
                            <p className="text-sm text-gray-500">
                              Category: {item.category || "Uncategorized"} | Quantity:{" "}
                              {item.quantity.value || 0} {item.quantity.unit || "Unit"}
                            </p>
                          </div>
                        </div>
                        <p className="text-green-600 font-bold">
                          $
                          {item.price && item.quantity.value
                            ? (item.price * item.quantity.value).toFixed(2)
                            : "0.00"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No items found for this order.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
