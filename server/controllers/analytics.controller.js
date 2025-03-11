import {
  getAnalyticsData,
  getDailySalesData,
} from "../service/analytics.service.js";

// Controller to handle overall analytics request
export const fetchAnalytics = async (req, res) => {
  try {
    const data = await getAnalyticsData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to handle daily sales data request
export const fetchDailySales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const data = await getDailySalesData(startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
