import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import Spinner from "../components/Spinner";

interface Item {
  imageUrl: string;
  name: string;
  price: number;
  category: string;
  quantity: { value: number; unit: string }[];
}

function Products() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get<{ items: Item[] }>(
          "http://localhost:1000/api/v1/item/get-all-items"
        );
        setItems(res.data.items);
      } catch (err) {
        console.error("Error fetching items:", err);
        setErrorMessage("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <div className="flex justify-center text-center content-center">
        {loading && <Spinner />}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
      {!loading && !errorMessage && (
        <div className="m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.name}>
                <Card data={item} />
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Products;
