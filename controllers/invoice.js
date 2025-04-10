const Invoice = require("../schemas/invoice");
const InvoiceItem = require("../schemas/invoiceItems");

module.exports = {
  // Create a new invoice
  createInvoice: async (req, res) => {
    const session = await Invoice.startSession();
    session.startTransaction();

    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items,
      } = req.body;

      // Calculate total amount
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create the invoice
      const newInvoice = new Invoice({
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        totalAmount,
      });

      const savedInvoice = await newInvoice.save({ session });

      // Create invoice items
      const invoiceItems = items.map((item) => ({
        invoiceId: savedInvoice._id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      await InvoiceItem.insertMany(invoiceItems, { session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ success: true, data: savedInvoice });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get all invoices with their items
  getAllInvoices: async (req, res) => {
    try {
      const invoices = await Invoice.find().sort({ createdAt: -1 });
      const invoicesWithItems = await Promise.all(
        invoices.map(async (invoice) => {
          const items = await InvoiceItem.find({ invoiceId: invoice._id });
          return { ...invoice.toObject(), items };
        })
      );

      res.status(200).json({ success: true, data: invoicesWithItems });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get a single invoice by ID with its items
  getInvoiceById: async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id);
      if (!invoice) {
        return res
          .status(404)
          .json({ success: false, message: "Invoice not found" });
      }

      const items = await InvoiceItem.find({ invoiceId: id });
      res
        .status(200)
        .json({ success: true, data: { ...invoice.toObject(), items } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update an invoice status
  updateInvoiceStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedInvoice = await Invoice.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedInvoice) {
        return res
          .status(404)
          .json({ success: false, message: "Invoice not found" });
      }

      res.status(200).json({ success: true, data: updatedInvoice });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Delete an invoice and its items
  deleteInvoice: async (req, res) => {
    const session = await Invoice.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      const deletedInvoice = await Invoice.findByIdAndDelete(id, { session });
      if (!deletedInvoice) {
        throw new Error("Invoice not found");
      }

      await InvoiceItem.deleteMany({ invoiceId: id }, { session });

      await session.commitTransaction();
      session.endSession();

      res
        .status(200)
        .json({ success: true, message: "Invoice deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
