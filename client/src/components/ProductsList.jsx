import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { Trash, Star, ChevronDown, ChevronUp } from "lucide-react";

const classes = {
  container: "mt-6 w-full max-w-5xl mx-auto bg-white p-6 rounded-lg flex flex-col items-center", 
  title: "text-lg font-semibold text-gray-700 mb-4 text-left",
  list: "w-full flex flex-col items-center space-y-4",
  card: "w-full max-w-4xl p-4  rounded-lg shadow-sm cursor-pointer transition-all duration-300 flex",
  expandedCard: "bg-gray-100 p-6 ",
  image: "w-24 h-24 object-cover rounded-lg",
  infoContainer: "ml-4 flex flex-col overflow-x-auto overflow-y-auto ",
  name: "text-sm font-medium text-gray-800 mt-2  ",
  price: "text-xs text-gray-500",
  description: "text-xs text-gray-600 mt-2 ",
  actions: "flex  mt-2",
  button: "p-2 rounded-md hover:bg-gray-100",
  featured: "text-yellow-500",
  pagination: "w-full flex justify-between items-center mt-4 px-4",
  pageButton: "px-3 py-1 bg-orange-500 text-white rounded-md disabled:opacity-50 hover:bg-orange-600",
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
                
                {expandedCard === product._id && <div>
                    <p className={classes.price}>Quantity: {product.quantity}</p>

                  <p className={classes.description}>{product.description}</p>
                 </div>}
                <div className={classes.actions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFeaturedProducts(product._id);
                    }}
                    className={`${classes.button} ${product.isFeatured ? classes.featured : ""}`}
                  >
                    <Star />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProduct(product._id);
                    }}
                    className={classes.button}
                  >
                    <Trash className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="flex items-center ml-auto betwee">
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
          <span>
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
