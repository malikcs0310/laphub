import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },

    price: { type: Number, required: true, min: 0 },
    condition: String,
    location: String,
    description: String,

    type: String,
    brand: String,
    model: String,

    processor: String,
    generation: String,
    ram: String,
    storage: String,
    screenSize: String,
    resolution: String,
    gpu: String,
    os: String,
    batteryHealth: String,

    stock: { type: Number, default: 1 },

    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },

    images: [String],
  },
  { timestamps: true },
);

export default mongoose.model("Laptop", laptopSchema);
