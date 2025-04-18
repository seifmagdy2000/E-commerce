import Product from "../models/Product.js";
import { paginate } from "../utils/pagination.js";
import redis from "../config/redis.js";
import cloudinary from "../config/cloud.js";

// Fetch all products with pagination
export const getAllProductsService = async (page = 1, limit = 10) => {
  try {
    return await paginate(Product, page, limit);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get featured products (cached)
export const featuredProductsService = async () => {
  try {
    let featured = await redis.get("featured_products");
    if (featured) return JSON.parse(featured);

    featured = await Product.find({ isFeatured: true }).limit(3).lean();
    if (!featured.length) return [];

    await redis.set("featured_products", JSON.stringify(featured), "EX", 3600);
    return featured;
  } catch (error) {
    console.error("Error fetching featured products:", error.message);
    throw new Error("Could not fetch featured products");
  }
};

// Add a product with Cloudinary image upload
export const addProductService = async (product) => {
  try {
    let imageUrl = "";

    // Check if image exists and is Base64
    if (product.image && product.image.startsWith("data:image")) {
      const cloudResponse = await cloudinary.uploader.upload(product.image, {
        folder: "products",
      });
      imageUrl = cloudResponse.secure_url;
    }

    const newProduct = new Product({
      ...product,
      image: imageUrl,
    });

    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error("Error saving product: " + error.message);
  }
};

// Delete a product and its Cloudinary image
export const deleteProductService = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error("Product not found");

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error.message);
      }
    }

    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get recommended products randomly
export const getRecommendedProductsService = async () => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 3 } }]);
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get products by category
export const getProductsByCategoryService = async (category) => {
  try {
    const products = await Product.find({ category }).lean();
    console.log(products);

    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Toggle featured status & update cache
export const toggleFeaturedProductsService = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) return null;

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    await updateFeaturedProductsCache();
    return updatedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update the featured products cache
async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set(
      "featured_products",
      JSON.stringify(featuredProducts),
      "EX",
      86400
    );
    console.log("Featured products cache updated");
  } catch (error) {
    console.error("Error updating featured products cache:", error.message);
  }
}
