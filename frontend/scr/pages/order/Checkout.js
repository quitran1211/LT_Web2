import React, { useState, useEffect } from "react";
import { createOrder } from "../../services/OrderService";
import { getCart } from "../../services/CartService";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart: passedCart = [], quantities = {} } = location.state || {};

    const [cart, setCart] = useState(Array.isArray(passedCart) ? passedCart : []);
    const [delivery, setDelivery] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        street: "",
    });

    // 🧑‍💻 Load user info từ localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        try {
            const user = JSON.parse(storedUser);
            setUserInfo({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.mobileNumber || "",
                country: user.address?.country || "",
                city: user.address?.city || "",
                street: user.address?.street || "",
            });
        } catch (err) {
            console.error("❌ Lỗi parse user từ localStorage:", err);
        }
    }, []);

    // 🛒 Load cart từ API nếu không có dữ liệu từ location.state
    useEffect(() => {
        const fetchCart = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;

            try {
                const user = JSON.parse(storedUser);
                const cartId = user.cart?.cartId;
                const emailId = user.email;

                if (!cartId || !emailId) {
                    console.warn("❌ Không có cartId hoặc emailId, không thể load cart");
                    return;
                }

                // Lấy cart từ backend
                const data = await getCart(emailId, cartId);

                // Cập nhật cart state
                setCart(Array.isArray(data.products) ? data.products : []);
            } catch (err) {
                console.error("❌ Failed to load cart:", err);
            }
        };

        // Nếu cart rỗng, fetch từ backend
        if (!cart || cart.length === 0) {
            fetchCart();
        }
    }, [cart]);


    // Tính tổng tiền dựa trên quantities
    const totalPrice = Array.isArray(cart)
        ? cart.reduce((sum, item) => {
            const qty = quantities[item.productId] ?? item.quantity ?? 1;
            return sum + (Number(item.price) || 0) * qty;
        }, 0)
        : 0;

    // Tính phí vận chuyển và tổng cuối cùng
    const shippingFee = totalPrice >= 200000 ? 0 : 15000;
    const finalTotal = totalPrice + shippingFee;

    // Hàm format tiền VND
    const formatPrice = (price) =>
        (Number(price) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const handleConfirm = async () => {
        const storedUserRaw = localStorage.getItem("user");
        if (!storedUserRaw) {
            alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        const storedUser = JSON.parse(storedUserRaw);
        const emailId = userInfo.email;
        const cartId = storedUser.cart?.cartId;

        if (!emailId || !cartId || !paymentMethod) {
            alert("Thiếu thông tin để tạo đơn hàng");
            return;
        }

        // Fix paymentMethod ≥ 4 ký tự
        let method = paymentMethod.toUpperCase();
        if (method === "COD") method = "CASH"; // backend chấp nhận
        console.log("DEBUG: phương thức thanh toán gửi:", method);

        try {
            const res = await createOrder(emailId, cartId, method);
            alert("Đặt hàng thành công!");
            localStorage.removeItem("cart");
            navigate("/");
            console.log("✅ Order created:", res);
        } catch (err) {
            if (err.response) {
                console.error("❌ Backend status:", err.response.status);
                console.error("❌ Backend data:", err.response.data);
            } else {
                console.error("❌ Lỗi khi gọi API:", err.message);
            }
            alert("Đặt hàng thất bại! Xem console để debug.");
        }
    };

    return (
        <section className="section-content padding-y">
            <div className="container" style={{ maxWidth: "1100px" }}>
                <div className="row">
                    {/* Left Column: Delivery & Payment */}
                    <div className="col-md-7">
                        {/* DELIVERY INFO */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h4 className="card-title mb-3">Thông tin giao hàng</h4>

                                {/* USER INFO FORM */}
                                <div className="form-row">
                                    <div className="col form-group">
                                        <label>First name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={userInfo.firstName}
                                            onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="col form-group">
                                        <label>Last name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={userInfo.lastName}
                                            onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={userInfo.email}
                                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="col form-group">
                                        <label>Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={userInfo.phone}
                                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={userInfo.country}
                                            onChange={(e) => setUserInfo({ ...userInfo, country: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={userInfo.city}
                                            onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Street</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        value={userInfo.street}
                                        onChange={(e) => setUserInfo({ ...userInfo, street: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT METHOD */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h4 className="card-title mb-4">Phương thức thanh toán</h4>
                                <div className="form-row">
                                    <div className="form-group col-sm-6">
                                        <label className={`js-check box ${paymentMethod === "cod" ? "active" : ""}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={paymentMethod === "cod"}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <h6 className="title">Thanh toán khi nhận hàng</h6>
                                            <p className="text-muted">Thanh toán khi nhận đơn hàng</p>
                                        </label>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <label className={`js-check box ${paymentMethod === "card" ? "active" : ""}`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card"
                                                checked={paymentMethod === "card"}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <h6 className="title">Thẻ tín dụng</h6>
                                            <p className="text-muted">Thanh toán trực tuyến an toàn</p>
                                        </label>
                                    </div>
                                </div>

                                {/* Credit Card Form */}
                                {paymentMethod === "card" && (
                                    <form role="form" style={{ maxWidth: "380px" }}>
                                        <div className="form-group">
                                            <label>Tên trên thẻ</label>
                                            <input type="text" className="form-control" placeholder="Ex. John Smith" required />
                                        </div>

                                        <div className="form-group">
                                            <label>Số thẻ</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="" />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">
                                                        <i className="fab fa-cc-visa"></i> &nbsp;
                                                        <i className="fab fa-cc-amex"></i> &nbsp;
                                                        <i className="fab fa-cc-mastercard"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Ngày hết hạn</label>
                                                    <div className="form-inline" style={{ minWidth: "220px" }}>
                                                        <select className="form-control" style={{ width: "100px" }}>
                                                            <option>MM</option>
                                                            <option>01 - January</option>
                                                            <option>02 - February</option>
                                                            <option>03 - March</option>
                                                        </select>
                                                        <span style={{ width: "20px", textAlign: "center" }}> / </span>
                                                        <select className="form-control" style={{ width: "100px" }}>
                                                            <option>YY</option>
                                                            <option>2025</option>
                                                            <option>2026</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label title="3 digits code on back side of the card">CVV</label>
                                                    <input className="form-control" type="text" required />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                <button className="btn btn-primary btn-block mt-3" type="button" onClick={handleConfirm}>
                                    Confirm Order
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Your Order */}
                    <div className="col-md-5">
                        <div className="card mb-4">
                            <div className="card-body">
                                <h4 className="card-title mb-3">Đơn hàng của bạn</h4>
                                {!Array.isArray(cart) || cart.length === 0 ? (
                                    <p>Giỏ hàng đang trống.</p>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {cart.map((item, index) => {
                                            const qty = quantities[item.productId] ?? item.quantity ?? 1;
                                            const itemTotal = (Number(item.price) || 0) * qty;
                                            return (
                                                <li key={item.productId ?? index} className="list-group-item d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={`http://localhost:8080/api/public/products/image/${item.image}`}
                                                            width="60" height="60" className="mr-2 rounded" alt={item.productName}
                                                        />
                                                        <div>
                                                            <p className="mb-1">{item.productName} x {qty}</p>
                                                            <small className="text-muted">{formatPrice(item.price)}</small>
                                                        </div>
                                                    </div>
                                                    <strong>{formatPrice(itemTotal)}</strong>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                                <hr />
                                <dl className="dlist-align">
                                    <dt>Phí vận chuyển:</dt>
                                    <dd className="text-right text-success">
                                        {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                                    </dd>
                                </dl>
                                <div className="d-flex justify-content-between">
                                    <strong>Tổng tiền:</strong>
                                    <strong>{formatPrice(finalTotal)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;
