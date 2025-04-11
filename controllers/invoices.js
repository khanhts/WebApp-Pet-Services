const Invoice = require("../schemas/invoice");
const InvoiceItem = require("../schemas/invoiceItem");

module.exports = {
  CreateInvoice: async function (invoiceData) {
    try {
      const newInvoice = new Invoice({
        customerId: invoiceData.customerId,
        totalAmount: invoiceData.totalAmount,
      });
      const savedInvoice = await newInvoice.save();

      const invoiceItems = invoiceData.items.map((item) => ({
        invoiceId: savedInvoice._id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      await InvoiceItem.insertMany(invoiceItems);

      return savedInvoice;
    } catch (error) {
      throw new Error("Error creating invoice: " + error.message);
    }
  },

  GetAllInvoices: async function () {
    try {
      return await Invoice.find().populate("customerId"); // Populate customer details if needed
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetMyInvoices: async function (customerId) {
    try {
      return await Invoice.find({ customerId }).populate("customerId");
    } catch (error) {
      throw new Error("Error fetching invoices: " + error.message);
    }
  },

  GetInvoiceDetails: async function (invoiceId) {
    try {
      const invoice = await Invoice.findById(invoiceId).populate("customerId");
      if (!invoice) {
        throw new Error("Invoice not found");
      }

      const invoiceItems = await InvoiceItem.find({ invoiceId });
      return { invoice, items: invoiceItems };
    } catch (error) {
      throw new Error("Error fetching invoice details: " + error.message);
    }
  },

  UpdateInvoiceStatus: async function (invoiceId, status) {
    try {
      // Find the invoice by ID and update its status
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new Error("Invoice not found");
      }

      invoice.status = status; // Update the status field
      return await invoice.save(); // Save the updated invoice
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CancelInvoice: async function (invoiceId, userId) {
    try {
      const invoice = await Invoice.findById(invoiceId);

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      if (invoice.customerId._id.toString() !== userId.toString()) {
        throw new Error("You are not authorized to cancel this invoice");
      }

      invoice.status = "Cancelled";
      return await invoice.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
