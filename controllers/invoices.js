const mongoose = require("mongoose");
const Invoice = require("../schemas/invoice");
const InvoiceItem = require("../schemas/invoiceItem");

module.exports = {
  // Create a new invoice
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
};
