import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    costPrice: { type: Number, default: 0, min: 0 },
    sellingPrice: { type: Number, default: 0, min: 0 },
    price: { type: Number, min: 0 },
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

// Virtuals
laptopSchema.virtual("profit").get(function () {
  return (this.sellingPrice || this.price || 0) - (this.costPrice || 0);
});

laptopSchema.virtual("profitMargin").get(function () {
  const cost = this.costPrice || 1;
  const profit = this.profit;
  return ((profit / cost) * 100).toFixed(1);
});

// ✅ FOR MONGOOSE 9.x - async function (no next parameter)
laptopSchema.pre("save", async function () {
  if (this.sellingPrice) {
    this.price = this.sellingPrice;
  }
  // No next() call needed
});

// Indexes
laptopSchema.index({ status: 1, featured: 1 });
laptopSchema.index({ brand: 1 });
laptopSchema.index({ sellingPrice: 1 });

export default mongoose.model("Laptop", laptopSchema);
