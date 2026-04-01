import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    condition: String,
    location: String,
    description: String,

    type: String,
    brand: String,
    model: String,

    processor: String,
    ram: String,
    storage: String,
    screenSize: String,

    images: [String], // image paths
  },
  { timestamps: true },
);

export default mongoose.model("Laptop", laptopSchema);
