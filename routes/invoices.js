const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoices");
let { check_authentication } = require("../utils/check_auth");

router.get("/my", check_authentication, async (req, res) => {
  try {
    const customerId = req.user._id;
    console.log("customerId", customerId);
    const invoices = await invoiceController.GetMyInvoices(customerId);
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", check_authentication, async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoiceDetails = await invoiceController.GetInvoiceDetails(invoiceId);
    res.status(200).json({ success: true, data: invoiceDetails });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.post("/", check_authentication, async (req, res) => {
  try {
    const invoiceData = req.body;
    console.log(invoiceData);
    const newInvoice = await invoiceController.CreateInvoice(invoiceData);
    res.status(201).json({ success: true, data: newInvoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
