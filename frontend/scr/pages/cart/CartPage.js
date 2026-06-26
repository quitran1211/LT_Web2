// src/pages/cart/CartPage.js
import React, { useEffect, useState } from "react";
import { getCart, updateQuantity, removeFromCart } from "../../services/CartService";
import { getUser } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();

    const user = getUser();
    const cartId = user?.cart?.cartId;
    const emailId = user?.email;

    console.log("🧑‍💻 User hiện tại:", user);
    console.log("🛒 CartId lấy từ user:", cartId);

    // Khởi tạo cart + quantities khi load trang
    useEffect(() => {
        const fetchCart = async () => {
            if (!cartId || !emailId) {
                setLoading(false);
                return;
            }

            try {
                const res = await getCart(emailId, cartId);
                console.log("📦 Dữ liệu trả về từ API getCart:", res);
                setCart(res);

                // Lấy quantities từ localStorage nếu có, fallback về 1
                const storedQuantities = JSON.parse(localStorage.getItem(`cart-quantities-${cartId}`)) || {};
                const initialQuantities = {};
                res.products.forEach((p) => {
                    initialQuantities[p.productId] = storedQuantities[p.productId] || 1;
                });
                setQuantities(initialQuantities);
            } catch (err) {
                console.error("⚠️ Lỗi khi lấy giỏ hàng:", err);
                setCart({ products: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [cartId, emailId]);

    // Khi thay đổi số lượng local
    const handleQuantityChangeLocal = (productId, value) => {
        setQuantities((prev) => {
            const newQuantities = {
                ...prev,
                [productId]: value,
            };
            // Lưu vào localStorage
            localStorage.setItem(`cart-quantities-${cartId}`, JSON.stringify(newQuantities));
            return newQuantities;
        });
    };

    // Khi rời select → update backend
    const handleUpdateBackend = async (productId) => {
        if (!cartId || !productId) return;
        try {
            await updateQuantity(cartId, productId, quantities[productId]);
            const updatedCart = await getCart(emailId, cartId);
            setCart(updatedCart);
        } catch (err) {
            alert("⚠️ Lỗi khi cập nhật số lượng lên backend");
        }
    };

    // Xóa sản phẩm
    const handleRemove = async (productId) => {
        if (!cartId || !productId) return;
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            await removeFromCart(cartId, productId);
            const updatedCart = await getCart(emailId, cartId);
            setCart(updatedCart);

            // Xóa số lượng trong localStorage
            const storedQuantities = JSON.parse(localStorage.getItem(`cart-quantities-${cartId}`)) || {};
            delete storedQuantities[productId];
            localStorage.setItem(`cart-quantities-${cartId}`, JSON.stringify(storedQuantities));

            setQuantities((prev) => {
                const newQuantities = { ...prev };
                delete newQuantities[productId];
                return newQuantities;
            });
        } catch (err) {
            alert("⚠️ Lỗi khi xóa sản phẩm");
        }
    };

    // Checkout → truyền cart + quantities
    const handleCheckout = () => {
        navigate("/checkout", { state: { cart, quantities } });
    };

    if (loading) return <p>Đang tải giỏ hàng...</p>;
    if (!cart || !cart.products || cart.products.length === 0)
        return <p style={{ padding: "100px", textAlign: "center" }}>🛒 Giỏ hàng của bạn đang trống.</p>;

    // Tính tổng giá trị sản phẩm
    const total = cart.products.reduce(
        (sum, item) => sum + (item.specialPrice || item.price) * (quantities[item.productId] || 1),
        0
    );

    const shippingFee = total >= 200000 ? 0 : 15000;
    const finalTotal = total + shippingFee;

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <main className="col-md-9">
                        <div className="card">
                            <table className="table table-borderless table-shopping-cart">
                                <thead className="text-muted">
                                    <tr className="small text-uppercase">
                                        <th scope="col">Sản phẩm</th>
                                        <th scope="col" width="120">Số lượng</th>
                                        <th scope="col" width="120">Giá</th>
                                        <th scope="col" className="text-right" width="200"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.products.map((item) => (
                                        <tr key={item.productId}>
                                            <td>
                                                <figure className="itemside">
                                                    <div className="aside">
                                                        <img
                                                            src={`http://localhost:8080/api/public/products/image/${item.image}`}
                                                            className="img-sm"
                                                            alt={item.productName}
                                                        />
                                                    </div>
                                                    <figcaption className="info">
                                                        <span className="title text-dark">{item.productName}</span>
                                                    </figcaption>
                                                </figure>
                                            </td>

                                            <td>
                                                <select
                                                    className="form-control"
                                                    value={quantities[item.productId] || 1}
                                                    onChange={(e) =>
                                                        handleQuantityChangeLocal(item.productId, Number(e.target.value))
                                                    }
                                                    onBlur={() => handleUpdateBackend(item.productId)}
                                                >
                                                    {[...Array(10)].map((_, q) => (
                                                        <option key={q + 1} value={q + 1}>{q + 1}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td>
                                                <div className="price-wrap">
                                                    <var className="price">
                                                        {((item.specialPrice || item.price) * (quantities[item.productId] || 1)).toLocaleString("vi-VN")} ₫
                                                    </var>
                                                    <small className="text-muted">
                                                        {(item.specialPrice || item.price).toLocaleString("vi-VN")} ₫ /1 món
                                                    </small>
                                                </div>
                                            </td>

                                            <td className="text-right">
                                                <button
                                                    className="btn btn-light btn-round"
                                                    onClick={() => handleRemove(item.productId)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="card-body border-top">
                                <button className="btn btn-primary float-md-right" onClick={handleCheckout}>
                                    Thanh toán <i className="fa fa-chevron-right"></i>
                                </button>
                                <a href="/" className="btn btn-light">
                                    <i className="fa fa-chevron-left"></i> Tiếp tục mua hàng
                                </a>
                            </div>
                        </div>

                        <div className="alert alert-success mt-3">
                            <p className="icontext">
                                <i className="icon text-success fa fa-truck"></i> Miễn phí vận chuyển cho đơn hàng trên 200.000₫
                            </p>
                        </div>
                    </main>

                    <aside className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <dl className="dlist-align">
                                    <dt>Tạm tính:</dt>
                                    <dd className="text-right">{total.toLocaleString("vi-VN")} ₫</dd>
                                </dl>
                                <dl className="dlist-align">
                                    <dt>Phí vận chuyển:</dt>
                                    <dd className="text-right text-success">
                                        {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")} ₫`}
                                    </dd>
                                </dl>
                                <hr />
                                <dl className="dlist-align">
                                    <dt>Tổng cộng:</dt>
                                    <dd className="text-right h5">
                                        <strong>{finalTotal.toLocaleString("vi-VN")} ₫</strong>
                                    </dd>
                                </dl>
                                <hr />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default CartPage;
