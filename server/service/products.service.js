import Product from "../models/Product.js";
import { paginate } from "../utils/pagination.js";

export const getAllProductsService = async (page = 1, limit = 10) => {
  try {
    return await paginate(Product, page, limit);
  } catch (error) {
    throw new Error(error.message);
  }
};
