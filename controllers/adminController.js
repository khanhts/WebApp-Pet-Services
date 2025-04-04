const Admin = require("../models/adminModel");

exports.adminLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Vui lòng nhập đủ thông tin" });
    }

    Admin.login(username, password, (err, admin) => {
        if (err) return res.status(500).json({ success: false, message: "Lỗi server" });

        if (admin) {
            return res.json({ success: true, message: "Đăng nhập thành công" });
        } else {
            return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
        }
    });
};
