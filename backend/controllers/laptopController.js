import Laptop from "../models/Laptop.js";

// ✅ CREATE (Already done)
export const addLaptop = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => file.filename);

    const laptop = new Laptop({
      ...req.body,
      images: imagePaths,
    });

    await laptop.save();

    res.status(201).json({
      message: "Laptop added successfully",
      laptop,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add laptop",
      error: error.message,
    });
  }
};

// ✅ READ ALL
export const getAllLaptops = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search && search.trim() !== "") {
      filter = {
        $or: [
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
        ],
      };
    }

    const laptops = await Laptop.find(filter).sort({ createdAt: -1 });

    res.status(200).json(laptops);
  } catch (error) {
    console.log("Error fetching laptops:", error);
    res.status(500).json({ message: "Failed to fetch laptops" });
  }
};
// Home page - get latest 4 laptops
export const getFeaturedLaptops = async (req, res) => {
  try {
    const laptops = await Laptop.find().sort({ createdAt: -1 }).limit(4);

    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ SINGLE
export const getSingleLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }

    res.json(laptop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE
export const updateLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }

    const updatedData = {
      title: req.body.title,
      price: req.body.price,
      condition: req.body.condition,
      location: req.body.location,
      description: req.body.description,
      type: req.body.type,
      brand: req.body.brand,
      model: req.body.model,
      processor: req.body.processor,
      ram: req.body.ram,
      storage: req.body.storage,
      screenSize: req.body.screenSize,
    };

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map((file) => file.filename);
    } else {
      updatedData.images = laptop.images;
    }

    const updatedLaptop = await Laptop.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    res.json({
      message: "Laptop updated successfully",
      laptop: updatedLaptop,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update laptop",
      error: error.message,
    });
  }
};

// ✅ DELETE
export const deleteLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }

    await laptop.deleteOne();

    res.json({ message: "Laptop deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
