import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, PlusCircle, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "../stores/useProductStore";

const classes = {
  formContainer: "w-full bg-white rounded-lg", 
  formGroup: "mb-4 flex flex-col",
  label: "block text-gray-700 font-medium mb-1 text-left",
  input: "w-full px-4 py-2 border border-gray-300 rounded-lg",
  select: "w-full px-4 py-2 border rounded-lg border-gray-300",
  fileInput: "w-full px-4 py-2 border border-gray-300 rounded-lg",
  button: "w-full py-2 mt-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2",
  buttonDisabled: "bg-gray-400 cursor-not-allowed",
  spinner: "w-5 h-5 animate-spin",
  imagePreview: "mt-2 w-24 h-24 object-cover rounded-lg border",
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
  
  const [preview, setPreview] = useState(null);
  const { createProduct, loading } = useProductStore();
  const categories = ["Jeans", "Shoes", "Jackets", "Tshirts", "Glasses", "Suits"];
  
  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, image: reader.result })); // Send Base64 string
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("description", formState.description);
    formData.append("price", formState.price);
    formData.append("category", formState.category);
    formData.append("quantity", formState.quantity);
    formData.append("image", formState.image);

    try {
      await createProduct(formData);
      setFormState({
        
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        quantity: "",
      });
    } catch (error) {
      toast.error("Failed to create product!");
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
        <div className={classes.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label htmlFor="name" className={classes.label}>Product Name</label>
              <input type="text" id="name" name="name" className={classes.input} value={formState.name} onChange={handleInputChange} required />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="description" className={classes.label}>Description</label>
              <textarea id="description" name="description" className={classes.input} value={formState.description} onChange={handleInputChange} required />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="price" className={classes.label}>Price ($)</label>
              <input type="number" id="price" name="price" className={classes.input} value={formState.price} onChange={handleInputChange} required />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="category" className={classes.label}>Category</label>
              <select id="category" name="category" className={classes.select} value={formState.category} onChange={handleInputChange} required>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="quantity" className={classes.label}>Quantity</label>
              <input type="number" id="quantity" name="quantity" className={classes.input} value={formState.quantity} onChange={handleInputChange} required />
            </div>

            <div className={classes.formGroup}>
              <label className={`${classes.label} flex items-center gap-2`}>
                <Upload size={20} />
                Upload Image
              </label>
              <input type="file" accept="image/*" onChange={handleFileChange} className={classes.fileInput} required />
              {preview && <img src={preview} alt="Preview" className={classes.imagePreview} />}
            </div>

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
