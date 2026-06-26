import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getUser, logout } from "../services/AuthService";
import { getAllCategories } from "../services/CategoryService";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: getUser(),
            categories: [],
        };
    }

    componentDidMount() {
        getAllCategories()
            .then((data) => this.setState({ categories: data }))
            .catch((err) => console.error("Lỗi khi tải danh mục:", err));
    }

    handleLogout = () => {
        logout();
        this.setState({ user: null });
        window.location.href = "/";
    };

    render() {
        const { user } = this.state;
        const userName = user
            ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
            : "Guest";

        return (
            <header className="section-header border-bottom shadow-sm">
                {/* --- Top bar --- */}
                <nav className="navbar navbar-expand-sm navbar-light " style={{ padding: "0.1rem 0" }}>
                    <div className="container d-flex justify-content-end">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                {user ? (
                                    <span className="nav-link">
                                        Xin chào, <b>{userName}</b> |{" "}
                                        <a href="#" onClick={this.handleLogout}>
                                            Đăng xuất
                                        </a>
                                    </span>
                                ) : (
                                    <span className="nav-link">
                                        Xin chào, <Link to="/login">Đăng nhập</Link> hoặc{" "}
                                        <Link to="/register">Đăng ký</Link>
                                    </span>
                                )}
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* --- Main header: logo + menu + icons --- */}
                <div className="bg-white">
                    <div className="container" style={{ padding: "0.5rem 0" }}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            {/* Logo */}
                            <Link
                                to="/"
                                className="d-flex align-items-center text-decoration-none"
                                style={{
                                    transition: "transform 0.3s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <img
                                    src={require("../assets/images/logo.jpg")}
                                    alt="Logo"
                                    style={{
                                        width: "100px",
                                        height: "auto",
                                        objectFit: "contain",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    }}
                                />
                            </Link>

                            {/* Navigation (mục lục nằm ngang giữa logo và icon) */}
                            <nav className="d-none d-md-block">
                                <ul className="nav justify-content-center">
                                    {[
                                        { name: "Trang chủ", path: "/" },
                                        { name: "Sản phẩm", path: "/product" },
                                        { name: "Danh mục", path: "/category" },
                                        { name: "Về chúng tôi", path: "/contact" },
                                    ].map((item, index) => (
                                        <li className="nav-item mx-3" key={index}>
                                            <Link
                                                to={item.path}
                                                className="nav-link fw-bold text-dark"
                                                style={{
                                                    fontSize: "1.25rem",
                                                    color: "#222",
                                                    position: "relative",
                                                    transition: "all 0.3s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = "#431603";
                                                    const underline = document.createElement("span");
                                                    underline.style.position = "absolute";
                                                    underline.style.bottom = "0";
                                                    underline.style.left = "50%";
                                                    underline.style.width = "60%";
                                                    underline.style.height = "2px";
                                                    underline.style.backgroundColor = "#431603";
                                                    underline.style.transform = "translateX(-50%)";
                                                    underline.style.transition = "width 0.3s ease";
                                                    underline.className = "hover-underline";
                                                    e.currentTarget.appendChild(underline);
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = "#222";
                                                    const underline = e.currentTarget.querySelector(".hover-underline");
                                                    if (underline) e.currentTarget.removeChild(underline);
                                                }}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Icons bên phải */}
                            <div className="d-flex align-items-center gap-3">
                                <Link to="/profile" className="nav-link text-dark">
                                    <i className="fa fa-user" style={{ fontSize: "1.3rem" }}></i>
                                </Link>
                                <Link to="/cart" className="nav-link text-dark position-relative">
                                    <i className="fa fa-shopping-cart" style={{ fontSize: "1.3rem" }}></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>


                {/* --- Dải màu thương hiệu nhỏ dưới header (tùy chọn, tạo điểm nhấn) --- */}
                <div style={{ backgroundColor: "#431603", height: "4px" }}></div>
            </header>
        );
    }
}

export default Header;
