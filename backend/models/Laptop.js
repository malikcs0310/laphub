import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, default: "Used" },
    location: { type: String, required: true },
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

// Generate slug before saving
laptopSchema.pre("save", async function (next) {
  if (this.slug) return next();

  if (!this.title) {
    return next(new Error("Title is required"));
  }

  const baseSlug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let slug = baseSlug;
  let counter = 1;

  const Laptop = mongoose.model("Laptop");
  while (await Laptop.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

export default mongoose.model("Laptop", laptopSchema);
