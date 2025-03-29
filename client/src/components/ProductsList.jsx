import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { Trash, Star, ChevronDown, ChevronUp } from "lucide-react";

const classes = {
  container: "mt-6 w-full max-w-5xl mx-auto bg-white p-6 rounded-lg flex flex-col items-center", 
  title: "text-xl font-semibold text-gray-800 mb-6",
  list: "w-full flex flex-col items-center space-y-6",
  card: "w-full max-w-4xl p-4 rounded-xl shadow-md border border-gray-200 transition-all duration-300 flex items-center gap-4 hover:shadow-lg",
  image: "w-28 h-28 object-cover rounded-lg border border-gray-300",
  infoContainer: "flex-1 flex flex-col justify-center",
  name: "text-lg font-semibold text-gray-900",
  price: "text-md font-medium text-gray-600 mt-1",
  category: "text-sm text-orange-600 font-medium mt-1",
  quantity: "text-sm text-gray-600 font-medium mt-1",
  description: "text-sm text-gray-700 mt-2",
  actions: "flex items-center gap-3 mt-3",
  button: "p-2 rounded-lg transition hover:bg-gray-200",
  featured: "text-yellow-500",
  pagination: "w-full flex justify-between items-center mt-6 px-4",
  pageButton: "px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 hover:bg-orange-600",
};

function ProductsList() {
  const {
    deleteProduct,
    toggleFeaturedProducts,
    products,
    fetchAllProducts,
    pagination = { currentPage: 1, totalPages: 1 },
  } = useProductStore();

  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Product List</h2>
      <div className={classes.list}>
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className={`${classes.card} ${expandedCard === product._id ? classes.expandedCard : ""}`}
              onClick={() => setExpandedCard(expandedCard === product._id ? null : product._id)}
            >
              <img src={product.image} alt={product.name} className={classes.image} />
              
              <div className={classes.infoContainer}>
                <p className={classes.name}>{product.name}</p>
                <p className={classes.price}>${product.price}</p>
                <p className={classes.quantity}>Stock: {product.quantity} available</p>
                <p className={classes.category}>Category: {product.category}</p>

                {expandedCard === product._id && (
                  <p className={classes.description}>{product.description}</p>
                )}

                <div className={classes.actions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFeaturedProducts(product._id);
                    }}
                    className={`${classes.button} ${product.isFeatured ? "text-yellow-500" : "text-gray-600"}`}
                  >
                    <Star />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProduct(product._id);
                    }}
                    className={`${classes.button} text-red-500`}
                  >
                    <Trash />
                  </button>
                </div>
              </div>

              <div className="flex items-center ml-auto">
                {expandedCard === product._id ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available</p>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className={classes.pagination}>
          <button
            className={classes.pageButton}
            onClick={() => fetchAllProducts(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            className={classes.pageButton}
            onClick={() => fetchAllProducts(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductsList;
