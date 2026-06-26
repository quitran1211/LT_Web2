import axios from "axios";

const API_URL = "http://localhost:8080/api";

/**
 * Gọi API tạo đơn hàng mới
 * @param {string} emailId Email người dùng
 * @param {string|number} cartId ID giỏ hàng của người dùng
 * @param {string} paymentMethod Phương thức thanh toán (COD, BankTransfer, EWallet, ...)
 */
export const createOrder = async (emailId, cartId, paymentMethod) => {
    if (!emailId || !cartId || !paymentMethod) {
        throw new Error("Thiếu thông tin để tạo đơn hàng: emailId, cartId, hoặc paymentMethod");
    }

    try {
        const url = `${API_URL}/public/users/${encodeURIComponent(emailId)}/carts/${cartId}/payments/${encodeURIComponent(paymentMethod)}/order`;
        console.log("🚀 Gọi API tạo đơn hàng:", url);

        const res = await axios.post(url);
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi khi tạo đơn hàng:", error);
        throw error;
    }
};

/**
 * Lấy danh sách đơn hàng của người dùng
 */
export const getOrdersByUser = async (emailId) => {
    if (!emailId) throw new Error("Thiếu emailId");
    const res = await axios.get(`${API_URL}/public/users/${encodeURIComponent(emailId)}/orders`);
    return res.data;
};

/**
 * Lấy chi tiết đơn hàng
 */
export const getOrderDetail = async (emailId, orderId) => {
    if (!emailId || !orderId) throw new Error("Thiếu emailId hoặc orderId");
    const res = await axios.get(`${API_URL}/public/users/${encodeURIComponent(emailId)}/orders/${orderId}`);
    return res.data;
};
