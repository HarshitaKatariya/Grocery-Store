import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInr } from "@fortawesome/free-solid-svg-icons";

import { NavLink } from "react-router-dom";

interface Quantity {
  value: number;
  unit: string;
}

interface CardProps {
  data: {
    _id: string; // Unique identifier for each item
    imageUrl: string;
    name: string;
    price?: number; // Optional for categories
    category?: string; // Optional for categories
    quantity?: Quantity[]; // Optional for categories
  };
  onClick?: () => void; // Optional for category selection
}

const Card: React.FC<CardProps> = ({ data, onClick }) => {
  const { imageUrl, name, price, category, quantity } = data;

  return (
    <NavLink to={`/item-details/${data._id}`}>
      <div 
      onClick={onClick}
      className={`border rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg hover:bg-gray-200 transition-all duration-300 ease-in-out ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-32 h-32 object-cover mb-4 rounded"
      />
      <h3 className="text-lg font-semibold mb-2 hover:underline">{name}</h3>
      {category && <p className="text-gray-500 mb-2">Category: {category}</p>}
      {price !== undefined && (
        <p className="text-blue-500 font-bold mb-2">
          Price: <FontAwesomeIcon icon={faInr} />
          {price}
        </p>
      )}
      {quantity && quantity.length > 0 && (
        <p className="text-sm text-gray-600">
          Quantity: {quantity[0].value} {quantity[0].unit}
        </p>
      )}
    </div>
    </NavLink>
    
  );
};

export default Card;
