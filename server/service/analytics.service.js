import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Fetch overall analytics data
export const getAnalyticsData = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null, // Groups all documents together
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
      totalRevenue: 0,
      totalSales: 0,
    };

    return {
      users: totalUsers,
      products: totalProducts,
      totalSales,
      totalRevenue,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to retrieve analytics data");
  }
};

// Fetch daily sales data
export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateArray = getDateInRange(startDate, endDate);
    return dateArray.map((date) => {
      const dateString = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
      const foundData = dailySalesData.find((d) => d._id === dateString);
      return {
        date: dateString,
        sales: foundData?.totalSales || 0,
        revenue: foundData?.totalRevenue || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
    throw new Error("Failed to retrieve daily sales data");
  }
};

// Helper function to generate an array of dates within a range
function getDateInRange(startDate, endDate) {
  const dateArray = [];
  let currentDate = new Date(startDate);
  endDate = new Date(endDate);

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}
