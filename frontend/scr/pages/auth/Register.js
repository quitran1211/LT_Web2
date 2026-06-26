import React, { useState } from "react";
import { register } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        // Chỉ gửi user + address + cart, không gửi roles
        const data = {
            firstName: form.firstName,
            lastName: form.lastName,
            mobileNumber: form.mobileNumber,
            email: form.email,
            password: form.password,

            address: {
                street: "chua cap nhat",
                city: "chua cap nhat",
                state: "chua cap nhat",
                country: "chua cap nhat",
                pincode: "000000",
                buildingName: "chua cap nhat"
            },
            cart: {
                cartId: 0,
                totalPrice: 0,
                products: []
            }
        };

        try {
            const res = await register(data); // 201 Created cũng vào try
            if (res.data["jwt-token"]) localStorage.setItem("token", res.data["jwt-token"]);
        } catch (err) {
            console.warn("Đăng ký lỗi:", err);
        }
        alert("Đăng ký thành công!");
        navigate("/login");



    };

    return (
        <div className="card mx-auto" style={{ maxWidth: "520px", marginTop: "40px" }}>
            <article className="card-body">
                <header className="mb-4">
                    <h4 className="card-title">Đăng ký</h4>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="col form-group">
                            <label>Tên</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            />
                        </div>
                        <div className="col form-group">
                            <label>Họ</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <small className="form-text text-muted">
                            Chúng tôi sẽ không chia sẻ email của bạn cho bất kì ai.
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            className="form-control"
                            value={form.mobileNumber}
                            onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Mật khẩu</label>
                            <input
                                className="form-control"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Xác nhận mật khẩu</label>
                            <input
                                className="form-control"
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block">
                            Đăng ký
                        </button>
                    </div>

                    <div className="form-group">
                        <label className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" defaultChecked />
                            <div className="custom-control-label">
                                Tôi đồng ý với <a href="">điều khoản và điều kiện</a>
                            </div>
                        </label>
                    </div>
                </form>
            </article>

            <p className="text-center mt-4">
                Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
            </p>
        </div>
    );
};

export default Register;
