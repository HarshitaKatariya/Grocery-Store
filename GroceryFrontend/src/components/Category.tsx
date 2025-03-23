
import grains from '../images/Grains.png';
import dairy_bakery from '../images/dairy_bakery.png';
import pulses from '../images/pulses.png';
import snacks from '../images/snacks.png';
import spices from '../images/spices.png';
import extra from '../images/extra.png';
import { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import Card from './Card';


interface Item {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

// Define the structure for a category
interface Category {
  name: string;
  image: string;
}
function Categories() {

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  // Define categories with images and names
  const categories : Category[] = [
    { name: 'Grains', image: grains },
    { name: 'Dairy & Bakery', image: dairy_bakery },
    { name: 'Pulses', image: pulses },
    { name: 'Snacks', image: snacks },
    { name: 'Spices', image: spices },
    { name: 'Extra', image: extra}
  ];

  const fetchItemsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setErrorMessage('');
      setSelectedCategory(category);

      const response = await axios.get<{ items: Item[] }>(
        'https://grocery-store-68wb.onrender.com/api/v1/item/items',
        {
          params: { category },
        }
      );

      setItems(response.data.items);
    } catch (err) {
      console.error('Error fetching items by category:', err);
      setErrorMessage('Failed to fetch items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Featured Categories</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => fetchItemsByCategory(category.name)}
            className={`cursor-pointer text-center border rounded-lg p-4 ${
              selectedCategory === category.name ? 'bg-green-100' : ''
            } hover:bg-gray-100`}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-20 h-20 mx-auto rounded-full object-cover mb-2"
            />
            <p className="font-medium">{category.name}</p>
          </div>
        ))}
      </div>

      <div className="my-6">
        {loading && <div className='flex justify-center text-center'><Spinner /></div>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
           <Card data = {item}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
