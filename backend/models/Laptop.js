import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      // Remove auto-generation - we'll handle manually
    },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, default: "Used" },
    location: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, default: "" },
    brand: { type: String, default: "" },
    model: { type: String, default: "" },
    processor: { type: String, default: "" },
    generation: { type: String, default: "" },
    ram: { type: String, default: "" },
    storage: { type: String, default: "" },
    screenSize: { type: String, default: "" },
    resolution: { type: String, default: "" },
    gpu: { type: String, default: "" },
    os: { type: String, default: "" },
    batteryHealth: { type: String, default: "" },
    stock: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
    images: { type: [String], default: [] },
  },
  { timestamps: true },
);

// ✅ NO pre-save hook - remove completely to avoid errors
// Slug will be generated in controller if needed

// Add indexes for performance
laptopSchema.index({ status: 1, featured: 1 });
laptopSchema.index({ brand: 1 });
laptopSchema.index({ price: 1 });
laptopSchema.index({ createdAt: -1 });

export default mongoose.model("Laptop", laptopSchema);
