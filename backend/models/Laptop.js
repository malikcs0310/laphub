import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    // ✅ Optional slug (no auto-generation)
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },

    // ✅ PRICE FIELDS
    costPrice: { type: Number, required: true, min: 0 }, // Admin only
    sellingPrice: { type: Number, required: true, min: 0 }, // Customer sees
    price: { type: Number, min: 0 }, // Legacy/Compatibility

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
  {
    timestamps: true,
    // ✅ Virtual fields for profit (not stored in DB, calculated on the fly)
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ✅ Virtual field for profit (NO pre-save, NO next)
laptopSchema.virtual("profit").get(function () {
  return (this.sellingPrice || this.price || 0) - (this.costPrice || 0);
});

// ✅ Virtual field for profit margin
laptopSchema.virtual("profitMargin").get(function () {
  const cost = this.costPrice || 1;
  const profit = this.profit;
  return ((profit / cost) * 100).toFixed(1);
});

// ✅ Set price = sellingPrice (for compatibility)
laptopSchema.pre("save", function (next) {
  if (this.sellingPrice) {
    this.price = this.sellingPrice;
  }
  next(); // ✅ next is used correctly here
});

// Indexes for performance
laptopSchema.index({ status: 1, featured: 1 });
laptopSchema.index({ brand: 1 });
laptopSchema.index({ sellingPrice: 1 });

export default mongoose.model("Laptop", laptopSchema);
