import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { toast } from "react-hot-toast";

const classes = {
  container: "container mx-auto px-4 py-8",
  title: "text-3xl font-bold text-orange-500 mb-6 capitalize",
  grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
  card: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow",
  imageContainer: "h-48 bg-gray-200 flex items-center justify-center",
  image: "h-full w-full object-cover",
  details: "p-4",
  productName: "font-semibold text-lg mb-1",
  price: "text-gray-600 mb-2",
  stockBadge: "px-2 py-1 text-xs rounded-full",
  stockAvailable: "bg-green-100 text-green-800",
  stockUnavailable: "bg-red-100 text-red-800",
  featuredBadge: "bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full",
  loader: "flex justify-center items-center h-64",
  error: "p-4 text-red-500",
  pagination: "flex justify-center mt-8",
  button: "px-4 py-2 border rounded disabled:opacity-50",
};

const CategoryPage = () => {
  const { category } = useParams();
  const { fetchProductByCategory, products, loading, error, pagination } =
    useProductStore();

  // Fetch products when category changes
  useEffect(() => {
    if (category) {
      fetchProductByCategory(category);
    }
  }, [category, fetchProductByCategory]);

  // Check if no products were found AFTER loading completes
  useEffect(() => {
    if (!loading && products.length === 0) {
      toast.error(`No products found in ${category} category`);
    }
  }, [products, loading, category]);

  if (loading) {
    return (
      <div className={classes.loader}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.error}>
        <h2 className="text-xl font-bold">Error Loading Products</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{category.replace("-", " ")} Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products available in this category
          </p>
        </div>
      ) : (
        <>
          <div className={classes.grid}>
            {products.map((product) => (
              <div key={product._id} className={classes.card}>
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
                  <p className={classes.price}>${product.price.toFixed(2)}</p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`${classes.stockBadge} ${
                        product.inStock
                          ? classes.stockAvailable
                          : classes.stockUnavailable
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                    {product.isFeatured && (
                      <span className={classes.featuredBadge}>Featured</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className={classes.pagination}>
              <nav className="flex items-center gap-2">
                <button
                  disabled={pagination.currentPage === 1}
                  className={classes.button}
                >
                  Previous
                </button>
                <span>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={classes.button}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
