import Product from "../models/Product.js";
import { paginate } from "../utils/pagination.js";
import redis from "../config/redis.js";
import cloudinary from "../config/cloud.js";

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
    let cloudResponse = null;
    if (product.image) {
      cloudResponse = await cloudinary.uploader.upload(product.image, {
        folder: "products",
      });
    }

    const newProduct = new Product({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: cloudResponse?.secure_url || "",
      quantity: product.quantity,
    });

    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const deleteProductService = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log("deleted from cloudinary");
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error.message);
      }
    }
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getRecommendedProductsService = async () => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
        $project: {
          name: 1,
          description: 1,
          price: 1,
        },
      },
    ]);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getProductsByCategoryService = async (category) => {
  try {
    const products = await Product.find({ category }).lean();
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};
// export const toggleFeaturedProductsService = async (id) => {
//   try {
//     const pr

//   } catch (error) {

//   }
// }
