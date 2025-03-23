import React, { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    address: string;
    avatar: string;
  };
  items: {
    _id: string;
    quantity: {
      value: number;
      unit: string;
    };
    item: {
      _id: string;
      name: string;
      imageUrl: string;
      price: number;
    };
  }[];
}

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:1000/api/v1/order/get-all-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data || !response.data.orders) {
          throw new Error("Invalid API response structure");
        }

        setOrders(response.data.orders || []);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded-md shadow-sm bg-white"
          >
            <h2 className="text-lg font-semibold mb-2">
              Order ID: {order._id}
            </h2>
            <div className="flex items-center gap-4 mb-2">
              <img
                src={order.user?.avatar || "/placeholder-avatar.png"}
                alt={`${order.user?.username || "Unknown User"}'s avatar`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{order.user?.username || "Unknown User"}</p>
                <p className="text-sm text-gray-600">Email: {order.user?.email || "No Email"}</p>
                <p className="text-sm text-gray-600">Address: {order.user?.address || "No Address Provided"}</p>
              </div>
            </div>
            <h3 className="font-semibold">Items:</h3>
            <ul className="list-disc pl-5">
              {order.items?.length > 0 ? (
                order.items.map((item) => (
                  <li key={item._id} className="flex items-center gap-4 mb-2">
                    <img
                      src={item.item?.imageUrl || "/placeholder-image.png"}
                      alt={item.item?.name || "Unnamed Item"}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-medium">{item.item?.name || "Unnamed Item"}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity?.value || 0} {item.quantity?.unit || "N/A"}
                      </p>
                    </div>
                    <p className="text-green-600 font-bold">${item.item?.price || 0}</p>
                  </li>
                ))
              ) : (
                <li>No items in this order</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;
