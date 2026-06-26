import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService"; // 👈 import hàm login
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await login(formData); // 👈 dùng login từ authService
            alert("Đăng nhập thành công!");
            console.log("Login success:", data);
            window.location.href = "/";
        } catch (err) {
            console.error("Login error:", err);
            if (err.response && err.response.status === 401) {
                setError("Sai email hoặc mật khẩu!");
            } else {
                setError("Đăng nhập thất bại, vui lòng thử lại!");
            }
        }
    };

    return (
        <div className="card mx-auto" style={{ maxWidth: "380px", marginTop: "100px" }}>
            <div className="card-body">
                <h4 className="card-title mb-4">Đăng nhập</h4>

                {/* Thông báo lỗi nếu có */}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <input
                            name="email"
                            className="form-control"
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <input
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group d-flex justify-content-between align-items-center mb-3">
                        <a href="#" className="float-right">
                            Quên mật khẩu?
                        </a>
                        <label className="custom-control custom-checkbox m-0">
                            <input type="checkbox" className="custom-control-input" defaultChecked />
                            <div className="custom-control-label"> Ghi nhớ tôi </div>
                        </label>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block">
                            Đăng nhập
                        </button>
                    </div>
                </form>
            </div>

            <p className="text-center mt-4">
                Bạn không có tài khoản? <a href="/register">Đăng ký</a>
            </p>
        </div>
    );
};

export default Login;
