import Order from "../models/Order.js";
import Laptop from "../models/Laptop.js";
import { sendNewOrderEmail } from "../utils/sendEmail.js"; // ✅ Add this import

// Helper function to update stock when order placed
const updateStockOnOrder = async (items) => {
  for (const item of items) {
    const product = await Laptop.findById(item.productId);
    if (product) {
      const newStock = product.stock - item.quantity;
      await Laptop.findByIdAndUpdate(item.productId, {
        stock: newStock,
        status: newStock <= 0 ? "sold" : "available",
      });
      console.log(`📦 Stock updated: ${product.title} → ${newStock} left`);
    }
  }
};

// Helper function to restore stock when order cancelled
const restoreStockOnCancel = async (items) => {
  for (const item of items) {
    const product = await Laptop.findById(item.productId);
    if (product) {
      const newStock = product.stock + item.quantity;
      await Laptop.findByIdAndUpdate(item.productId, {
        stock: newStock,
        status: "available",
      });
      console.log(`🔄 Stock restored: ${product.title} → ${newStock} left`);
    }
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, subtotal, shipping, total, customer, notes, paymentMethod } =
      req.body;

    console.log("Creating order with data:", {
      items: items?.length,
      subtotal,
      shipping,
      total,
      customer: customer?.name,
      paymentMethod,
    });

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (
      !customer ||
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address
    ) {
      return res.status(400).json({ message: "Customer information required" });
    }

    // ✅ CHECK STOCK BEFORE CREATING ORDER
    for (const item of items) {
      const product = await Laptop.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          message: `Product ${item.title} not found`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.title} only ${product.stock} left in stock. Please reduce quantity.`,
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items: items.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || "",
      })),
      subtotal,
      shipping,
      total,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city || "Lahore",
        postalCode: customer.postalCode || "54000",
      },
      notes: notes || "",
      paymentMethod: paymentMethod || "cod",
    });

    await order.save();
    console.log("✅ Order saved successfully:", order.orderNumber);

    // ✅ Send email notification to admin
    await sendNewOrderEmail(order);

    // ✅ UPDATE STOCK AFTER ORDER
    await updateStockOnOrder(items);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        orderStatus: order.orderStatus,
        estimatedDelivery: order.estimatedDelivery,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order or is admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/admin/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.orderStatus;

    // ✅ If cancelling order, restore stock
    if (orderStatus === "cancelled" && previousStatus !== "cancelled") {
      await restoreStockOnCancel(order.items);
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel order (User)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Can only cancel if order is pending or processing
    if (order.orderStatus !== "pending" && order.orderStatus !== "processing") {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    // ✅ Restore stock when user cancels
    await restoreStockOnCancel(order.items);

    order.orderStatus = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully. Stock has been restored.",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });
    const processingOrders = await Order.countDocuments({
      orderStatus: "processing",
    });
    const shippedOrders = await Order.countDocuments({
      orderStatus: "shipped",
    });
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      orderStatus: "cancelled",
    });

    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const recentOrders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
