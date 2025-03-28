import React from "react";
import Category from "../components/Category";

const classes = {
  headingContainer: "text-center ", 
  titleText: "text-3xl font-bold text-orange-500 mb-2",
  paragraphText: "text-lg text-gray-600",
  mainContainer: "flex flex-col min-h-screen",
  grid: "grid grid-cols-1 md:grid-cols-3 gap-8 p-6",
};

const Categories = [
  { href: "/category/Jeans", name: "Jeans", imageUrl: "/jeans.jpeg" },
  { href: "/category/Shoes", name: "Shoes", imageUrl: "/shoes.jpeg" },
  { href: "/category/Tshirts", name: "Tshirts", imageUrl: "/tshirts.jpeg" },
  { href: "/category/Glasses", name: "Glasses", imageUrl: "/glasses.jpeg" },
  { href: "/category/Jackets", name: "Jackets", imageUrl: "/jackets.jpeg" },
  { href: "/category/Suits", name: "Suits", imageUrl: "/suits.jpeg" },
];

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Title and description */}
      <div className={classes.headingContainer}>
        <h1 className={classes.titleText}>Explore our Categories</h1>
        <p className={classes.paragraphText}>Discover the best products for your needs</p>
      </div>

      {/* Categories */}
      <div className={classes.mainContainer}>
        <div className={classes.grid}>
          {Categories.map((category) => (
            <Category key={category.name} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
