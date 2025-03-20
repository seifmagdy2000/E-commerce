import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, PlusCircle, Loader, Divide } from "lucide-react";
import toast from "react-hot-toast";

const classes = {
  //container: "sm:px-6 lg:px-8",
  formContainer: "w-full bg-white rounded-lg", 
  formGroup: "mb-4 flex flex-col",
  label: "block text-gray-700 font-medium mb-1 text-left ", // Align labels to the left
  input: "w-full px-4 py-2 border border-gray-300 rounded-lg ",
  select: "w-full px-4 py-2 border rounded-lg border-gray-300 ",
  fileInput: "w-full px-4 py-2 border border-gray-300  rounded-lg ",
  button: "w-full py-2 mt-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2",
  buttonDisabled: "bg-gray-400 cursor-not-allowed",
  spinner: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin",
};


function CreateProductTab() {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    quantity: "",
  });

  const [loading, setLoading] = useState(false);
  const categories= ["Jeans","Shoes","Jackets","Tshirts","Glasses","Suits"]
  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormState({ ...formState, image: e.target.files[0] });
  };

  const validate = () => {
    if (!formState.name) return toast.error("Product name is required!");
    if (!formState.description) return toast.error("Description is required!");
    if (!formState.price || isNaN(formState.price) || formState.price <= 0)
      return toast.error("Valid price is required!");
    if (!formState.category) return toast.error("Category is required!");
    if (!formState.quantity || isNaN(formState.quantity) || formState.quantity < 0)
      return toast.error("Quantity must be a positive number!");
    if (!formState.image) return toast.error("Please upload an image!");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Creating product...",
        success: "Product created successfully!",
        error: "Something went wrong!",
      }
    ).then(() => {
      setFormState({ name: "", description: "", price: "", category: "", image: null, quantity: "" });
      setLoading(false);
    });
  };

  return (
    <div className={classes.container}>
      {/* Form Animation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
        <div className={classes.formContainer}>
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className={classes.formGroup}>
              <label htmlFor="name" className={classes.label}>Product Name</label>
              <input type="text" id="name" name="name" className={classes.input} value={formState.name} onChange={handleInputChange} required />
            </div>

            {/* Description */}
            <div className={classes.formGroup}>
              <label htmlFor="description" className={classes.label}>Description</label>
              <textarea id="description" name="description" className={classes.input} value={formState.description} onChange={handleInputChange} required />
            </div>

            {/* Price */}
            <div className={classes.formGroup}>
              <label htmlFor="price" className={classes.label}>Price ($)</label>
              <input type="number" id="price" name="price" className={classes.input} value={formState.price} onChange={handleInputChange} required />
            </div>

            {/* Category */}
            <div className={classes.formGroup}>
              <label htmlFor="category" className={classes.label}>Category</label>
              <select id="category" name="category" className={classes.select} value={formState.category} onChange={handleInputChange} required>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Quantity */}
            <div className={classes.formGroup}>
              <label htmlFor="quantity" className={classes.label}>Quantity</label>
              <input type="number" id="quantity" name="quantity" className={classes.input} value={formState.quantity} onChange={handleInputChange} required />
            </div>

            {/* Image Upload */}
            <div className={classes.formGroup}>
              <label className={`${classes.label} flex items-center gap-2`}>
                <Upload size={20} />
                Upload Image
              </label>
              <input type="file" accept="image/*" onChange={handleFileChange} className={classes.fileInput} required />
            </div>

            {/* Submit Button with Loading Spinner */}
            <motion.button
              type="submit"
              className={`${classes.button} ${loading ? classes.buttonDisabled : ""}`}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              disabled={loading}
            >
              {loading ? <Loader className={classes.spinner} /> : <PlusCircle size={20} />}
              {loading ? "Creating..." : "Create Product"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default CreateProductTab;
