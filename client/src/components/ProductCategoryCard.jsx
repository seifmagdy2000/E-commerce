import React, { use } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";


const classes = {
  card: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between",
  imageContainer: "h-48 bg-gray-200 flex items-center justify-center",
  image: "h-full w-full object-cover",
  details: "p-4",
  productName: "font-semibold text-lg mb-1",
  price: "text-gray-600 mb-2",
  stockBadge: "px-2 py-1 text-xs rounded-full",
  stockAvailable: "bg-green-100 text-green-800",
  stockUnavailable: "bg-red-100 text-red-800",
  featuredBadge: "bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full",
  button: "mt-3 w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300",
  secondaryButton: "mt-2 w-full   text-orange-500 py-2 px-4 rounded hover:bg-orange-50 transition duration-300",
};

const ProductCard = ({ product }) => {
  const {user} = useUserStore();
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add to cart!", {id: "login"});
      return;
    }
    toast.success("Product added to cart!",{id: "success"});
  };

  return (
    <div className={classes.card}>
      <div className={classes.imageContainer}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={classes.image}
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <div className={classes.details}>
        <h3 className={classes.productName}>{product.name}</h3>
        <div className="flex justify-between items-center mb-2">
        <p className={classes.price}>${product.price.toFixed(2)}</p>
        <span
            className={`${classes.stockBadge} ${
            product.quantity > 0
                ? classes.stockAvailable
                : classes.stockUnavailable
            }`}
        >
            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
        </span>
        </div>

        {product.isFeatured && (
        <span className={classes.featuredBadge}>Featured</span>
        )}


        <button
          onClick={handleAddToCart}
          className={classes.button}
          disabled={product.quantity === 0}
        >
          Add to Cart
        </button>

        <Link to={`/product/${product._id}`}>
          <button className={classes.secondaryButton}>View Details</button>
        </Link>
      </div>
    </div>
  );
};
export default ProductCard;