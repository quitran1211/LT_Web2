import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "../../services/OrderService";

const OrderTab = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const translateStatus = (status) => {
        switch (status) {
            case "Order Accepted !": return "Đã nhận đơn";
            case "Processing": return "Đang xử lý";
            case "Shipped": return "Đang giao hàng";
            case "Delivered": return "Đã giao hàng";
            case "Cancelled": return "Đã hủy";
            default: return status;
        }
    };


    useEffect(() => {
        if (!user?.email) return;

        const fetchOrders = async () => {
            try {
                const data = await getOrdersByUser(user.email);
                console.log("DEBUG: orders từ backend:", data);
                console.log(user);

                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("❌ Lỗi khi lấy đơn hàng:", err);
            }
        };

        fetchOrders();
    }, [user]);

    if (!orders.length) return <p>Chưa có đơn hàng nào.</p>;

    return (
        <>
            {orders.map((order) => (
                <article className="card mb-4" key={order.orderId}>
                    <header className="card-header d-flex align-items-center justify-content-between">
                        {/* Bên trái: Mã đơn + Ngày đặt hàng */}
                        <div>
                            <strong className="mr-3">Mã đơn: {order.orderId}</strong>
                            <span>Ngày đặt hàng: {new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>

                        {/* Bên phải: Trạng thái */}
                        <strong>
                            Trạng thái: {translateStatus(order.orderStatus)}
                        </strong>
                    </header>



                    <div className="card-body">
                        <div className="row">
                            {/* THÔNG TIN NGƯỜI ĐẶT HÀNG */}
                            <div className="col-md-8">
                                <h6 className="text-muted">Giao hàng đến:</h6>
                                <p>
                                    Tên người đặt hàng: <b>{user.firstName} {user.lastName}</b> <br />
                                    Số điện thoại: {user.mobileNumber || "N/A"} <br />
                                    Email: {order.email} <br />
                                    Địa chỉ: {user.address?.street}, {user.address?.buildingName}, {user.address?.city}, {user.address?.country}
                                </p>

                            </div>

                            {/* THÔNG TIN THANH TOÁN */}
                            <div className="col-md-4">
                                <h6 className="text-muted">Phương thức thanh toán</h6>
                                <span className="text-success">
                                    {order.payment?.paymentMethod || "N/A"}
                                </span>
                                <p>
                                    Phí vận chuyển: {order.totalAmount >= 200000 ? "Miễn phí" : "15.000₫"}<br />

                                    Tổng: {order.totalAmount.toLocaleString()}₫
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* DANH SÁCH SẢN PHẨM */}
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <tbody>
                                {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                                    order.orderItems.map((item) => (
                                        <tr key={item.orderItemId}>
                                            <td width="65">
                                                <img
                                                    src={`http://localhost:8080/api/public/products/image/${item.product.image}`}
                                                    className="img-xs border"
                                                    alt={item.product.productName}
                                                />
                                            </td>
                                            <td>
                                                <p className="title mb-0">{item.product.productName}</p>
                                                <var className="price text-muted">
                                                    {item.orderedProductPrice.toLocaleString()}₫ x {item.quantity}
                                                </var>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">Không có sản phẩm trong đơn hàng</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </article>
            ))}
        </>
    );
};

export default OrderTab;
