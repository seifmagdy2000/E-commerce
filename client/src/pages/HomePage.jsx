import React from "react";
import Category from "../components/Category";

const classes = {
  headingContainer: "text-center ", 
  titleText: "text-4xl font-extrabold text-orange-500",
  paragraphText: "text-lg text-gray-600",
  mainContainer: "flex flex-col min-h-screen", 
  grid: "grid grid-cols-1 md:grid-cols-3 gap-8 p-6",
};

const Categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpeg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpeg" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpeg" },
  { href: "/tshirts", name: "Tshirts", imageUrl: "/tshirts.jpeg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.jpeg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpeg" },
];

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Title and description with proper spacing */}
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
