import React from "react";

const classes = {
    mainContainer: "relative rounded-lg overflow-hidden group hover:shadow-lg transition duration-300 w-full ",
    image: "w-full h-full object-cover",
    overlay: "inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300",
    textContent: "absolute bottom-4 left-4 text-white",
    title: "text-xl font-bold",
    description: "text-sm opacity-80",
};

const Category = ({ category }) => {
  return (
    <a href={category.href} className={classes.mainContainer}>
      {/* Image */}
      <img src={category.imageUrl} alt={category.name} className={classes.image} />

      {/* Overlay */}
      <div className={classes.overlay}></div>

      {/* Text Content */}
      <div className={classes.textContent}>
        <h2 className={classes.title}>{category.name}</h2>
        <p className={classes.description}>Explore {category.name}</p>
      </div>
    </a>
  );
};

export default Category;
