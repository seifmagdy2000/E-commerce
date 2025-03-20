import { motion } from "framer-motion";
import { BarChart, PlusCircle, ShoppingBasket, View } from "lucide-react";
import React, { useState } from "react";
import CreateProductTab from "../components/CreateProductTab.jsx";
import ViewProductsTab from "../components/ViewProductsTab.jsx";
import AnalyticsTab from "../components/AnalyticsTab.jsx";

const classes = {
  container: " flex flex-col items-center justify-center sm:px-6 lg:px-8 w-full",
  title: "mt-6 text-center text-3xl font-extrabold text-orange-500",
  tabContainer: "min-w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg",
  tabList: "flex justify-between border-b border-gray-300",
  tab: "flex-1 text-center py-3 cursor-pointer font-medium text-xs sm:text-sm md:text-base",
  activeTab: "border-b-2 border-orange-500 text-orange-500 font-semibold",
  tabContent: "mt-6 text-center text-gray-700",
};

const tabs = [
  { id: "Create", label: "Create", icon: PlusCircle }, 
  { id: "Product", label: "Products", icon: ShoppingBasket },
  { id: "Analytics", label: "Analytics", icon: BarChart },
];

function AdminPage() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className={classes.container}>
      {/* Title Animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={classes.title}
      >
        Admin Dashboard
      </motion.h1>

      {/* Tabs Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className={classes.tabContainer}
      >
        <div className={classes.tabList}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${classes.tab} ${activeTab === tab.id ? classes.activeTab : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="inline-block mr-1 sm:mr-2" />
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className={classes.tabContent}>
          {activeTab === "Create" && <CreateProductTab/>}
          {activeTab === "Product" && <ViewProductsTab/>}
          {activeTab === "Analytics" && <AnalyticsTab/>}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminPage;
