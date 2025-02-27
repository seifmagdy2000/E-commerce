import {
  getAllProductsService,
  featuredProductsService,
  addProductService,
} from "../service/products.service.js";

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const products = await getAllProductsService(page, limit);

    if (!products.data.length) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Server error retriving all products",
      error: error.message,
    });
  }
};
export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await featuredProductsService();
    return res.status(200).json(featuredProducts);
  } catch (error) {
    return res.status(500).json({
      message: "Server error retriving featured products",
      error: error.message,
    });
  }
};
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, quantity } = req.body;
    if (!name || !description || !price || !category || !image || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newProduct = await addProductService(req.body);
    return res.status(200).json(newProduct);
  } catch (error) {
    return res.status(500).json({
      message: "Server error adding product",
      error: error.message,
    });
  }
};
