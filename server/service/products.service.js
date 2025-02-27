import Product from "../models/Product.js";
import { paginate } from "../utils/pagination.js";
import redis from "../config/redis.js";

export const getAllProductsService = async (page = 1, limit = 10) => {
  try {
    return await paginate(Product, page, limit);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const featuredProductsService = async () => {
  try {
    let featured = await redis.get("featured_products");
    if (featured) {
      return JSON.parse(featured);
    }

    featured = await Product.find({ isFeatured: true }).limit(3).lean();

    if (!featured.length) return [];

    // Cache result for 1 hour (3600 seconds)
    await redis.set("featured_products", JSON.stringify(featured), "EX", 3600);

    return featured;
  } catch (error) {
    console.error("Error fetching featured products:", error.message);
    throw new Error("Could not fetch featured products");
  }
};
export const addProductService = async (product) => {
  try {
    const newProduct = new Product(product);
    await newProduct.save();
  } catch (error) {
    throw new Error(error.message);
  }
};
