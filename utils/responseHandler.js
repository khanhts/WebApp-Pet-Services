exports.createResponse = (res, success, message, data = null) => {
    res.status(success ? 200 : 400).json({ success, message, data });
  };
  