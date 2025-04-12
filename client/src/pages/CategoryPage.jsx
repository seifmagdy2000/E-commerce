import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCategoryCard";

const classes = {
  container: "container mx-auto px-4 py-8",
  title: "text-3xl font-bold text-orange-500 mb-6 capitalize",
  grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
  loader: "flex justify-center items-center h-64",
  error: "p-4 text-red-500",
  pagination: "flex justify-center mt-8",
  button: "px-4 py-2 border rounded disabled:opacity-50",
};

const CategoryPage = () => {
  const { category } = useParams();
  const { fetchProductByCategory, products, loading, error, pagination } =
    useProductStore();

  useEffect(() => {
    if (category) {
      fetchProductByCategory(category);
    }
  }, [category, fetchProductByCategory]);

  if (loading) {
    return (
      <div className={classes.loader}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
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
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

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
