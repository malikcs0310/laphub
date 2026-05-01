import Contact from "../models/Contact.js";

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      contact: {
        id: newContact._id,
        name: newContact.name,
        email: newContact.email,
        subject: newContact.subject,
        createdAt: newContact.createdAt,
      },
    });
  } catch (error) {
    console.error("Create contact error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending message! Please try again.",
      error: error.message,
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching messages!",
    });
  }
};

// @desc    Get a single contact message by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found!",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Get contact by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching message!",
    });
  }
};

// @desc    Update a contact message (mark as read/replied)
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContact = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: "Message not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message updated successfully!",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Update contact error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating message!",
    });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: "Message not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully!",
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting message!",
    });
  }
};

// @desc    Get contact statistics (Admin)
// @route   GET /api/contact/stats
// @access  Private/Admin
export const getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({ status: "unread" });
    const read = await Contact.countDocuments({ status: "read" });
    const replied = await Contact.countDocuments({ status: "replied" });

    res.status(200).json({
      success: true,
      stats: {
        total,
        unread,
        read,
        replied,
      },
    });
  } catch (error) {
    console.error("Get contact stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics!",
    });
  }
};
