import Laptop from "../models/Laptop.js";
import mongoose from "mongoose";

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// ✅ CREATE - Add new laptop

export const addLaptop = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const laptop = new Laptop({
      title: req.body.title,
      costPrice: Number(req.body.costPrice),
      sellingPrice: Number(req.body.sellingPrice),
      price: Number(req.body.sellingPrice), // For compatibility
      condition: req.body.condition || "Used",
      location: req.body.location,
      description: req.body.description || "",
      type: req.body.type || "",
      brand: req.body.brand || "",
      model: req.body.model || "",
      processor: req.body.processor || "",
      generation: req.body.generation || "",
      ram: req.body.ram || "",
      storage: req.body.storage || "",
      screenSize: req.body.screenSize || "",
      resolution: req.body.resolution || "",
      gpu: req.body.gpu || "",
      os: req.body.os || "",
      batteryHealth: req.body.batteryHealth || "",
      stock: Number(req.body.stock) || 1,
      featured: req.body.featured === "true" || req.body.featured === true,
      status: req.body.status || "available",
      images: imageUrls,
    });

    await laptop.save();

    res.status(201).json({
      success: true,
      message: "Laptop added successfully",
      laptop,
    });
  } catch (error) {
    console.error("Add laptop error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add laptop",
      error: error.message,
    });
  }
};

// ✅ READ ALL - with filters and search
export const getAllLaptops = async (req, res) => {
  try {
    const {
      search,
      brand,
      processor,
      ram,
      storage,
      minPrice,
      maxPrice,
      condition,
      type,
      status,
    } = req.query;

    let filter = {};

    // Search functionality
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { processor: { $regex: search, $options: "i" } },
        { ram: { $regex: search, $options: "i" } },
        { storage: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { condition: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (brand) filter.brand = { $in: brand.split(",") };
    if (processor) filter.processor = { $regex: processor, $options: "i" };
    if (ram) filter.ram = { $regex: ram, $options: "i" };
    if (storage) filter.storage = { $regex: storage, $options: "i" };
    if (condition) filter.condition = condition;
    if (type) filter.type = type;
    if (status) filter.status = status;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const laptops = await Laptop.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: laptops.length,
      laptops,
    });
  } catch (error) {
    console.error("Error fetching laptops:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch laptops",
      error: error.message,
    });
  }
};

// ✅ GET FEATURED LAPTOPS (Home page)
export const getFeaturedLaptops = async (req, res) => {
  try {
    const laptops = await Laptop.find({ featured: true, status: "available" })
      .sort({ createdAt: -1 })
      .limit(4);

    res.json({
      success: true,
      laptops,
    });
  } catch (error) {
    console.error("Featured laptops error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ READ SINGLE LAPTOP
export const getSingleLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({
        success: false,
        message: "Laptop not found",
      });
    }

    res.json({
      success: true,
      laptop,
    });
  } catch (error) {
    console.error("Single laptop error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE LAPTOP
export const updateLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({
        success: false,
        message: "Laptop not found",
      });
    }

    // Update slug if title changed
    let slug = laptop.slug;
    if (req.body.title && req.body.title !== laptop.title) {
      slug = generateSlug(req.body.title);
    }

    const updatedData = {
      title: req.body.title || laptop.title,
      slug: slug,
      // ✅ PRICE FIELDS - UPDATED
      costPrice: Number(req.body.costPrice) || laptop.costPrice || 0,
      sellingPrice:
        Number(req.body.sellingPrice) ||
        laptop.sellingPrice ||
        laptop.price ||
        0,
      price:
        Number(req.body.sellingPrice) ||
        laptop.sellingPrice ||
        laptop.price ||
        0,
      condition: req.body.condition || laptop.condition,
      location: req.body.location || laptop.location,
      description: req.body.description || laptop.description,
      type: req.body.type || laptop.type,
      brand: req.body.brand || laptop.brand,
      model: req.body.model || laptop.model,
      processor: req.body.processor || laptop.processor,
      generation: req.body.generation || laptop.generation,
      ram: req.body.ram || laptop.ram,
      storage: req.body.storage || laptop.storage,
      screenSize: req.body.screenSize || laptop.screenSize,
      resolution: req.body.resolution || laptop.resolution,
      gpu: req.body.gpu || laptop.gpu,
      os: req.body.os || laptop.os,
      batteryHealth: req.body.batteryHealth || laptop.batteryHealth,
      stock: Number(req.body.stock) || laptop.stock,
      featured:
        req.body.featured === "true" ||
        req.body.featured === true ||
        laptop.featured,
      status: req.body.status || laptop.status,
    };

    // Handle new images upload
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map((file) => file.path);
    }

    const updatedLaptop = await Laptop.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      message: "Laptop updated successfully",
      laptop: updatedLaptop,
    });
  } catch (error) {
    console.error("Update laptop error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update laptop",
      error: error.message,
    });
  }
};

// ✅ DELETE LAPTOP
export const deleteLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({
        success: false,
        message: "Laptop not found",
      });
    }

    await laptop.deleteOne();

    res.json({
      success: true,
      message: "Laptop deleted successfully",
    });
  } catch (error) {
    console.error("Delete laptop error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE STOCK (for orders)
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const laptop = await Laptop.findById(id);
    if (!laptop) {
      return res.status(404).json({
        success: false,
        message: "Laptop not found",
      });
    }

    if (laptop.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    laptop.stock -= quantity;
    if (laptop.stock === 0) {
      laptop.status = "sold";
    } else if (laptop.stock > 0 && laptop.status === "sold") {
      laptop.status = "available";
    }

    await laptop.save();

    res.json({
      success: true,
      message: "Stock updated successfully",
      stock: laptop.stock,
      status: laptop.status,
    });
  } catch (error) {
    console.error("Update stock error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
