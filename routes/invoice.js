const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoice");

// Create a new invoice
router.post("/", invoiceController.createInvoice);

// Get all invoices with their items
router.get("/", invoiceController.getAllInvoices);

// Get a single invoice by ID with its items
router.get("/:id", invoiceController.getInvoiceById);

// Update an invoice status
router.put("/:id", invoiceController.updateInvoiceStatus);

// Delete an invoice and its items
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
