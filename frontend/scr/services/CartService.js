// src/services/CartService.js
import axios from "axios";
import { getToken, getUser } from "./AuthService";

const API_URL = "http://localhost:8080/api/public";

export const addToCart = async (cartId, productId, quantity) => {
    const token = getToken();
    try {
        const res = await axios.post(
            `${API_URL}/carts/${cartId}/products/${productId}/quantity/${quantity}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("🛒 Thêm vào giỏ thành công:", res.data);
        return res.data;
    } catch (err) {
        console.error("⚠️ Lỗi khi thêm vào giỏ:", err);
        throw err;
    }
};

// Lấy giỏ hàng theo user.email và cartId
export const getCart = async (email, cartId) => {
    if (!email || !cartId) throw new Error("Email hoặc cartId không tồn tại");

    const token = getToken();

    try {
        const res = await axios.get(`${API_URL}/users/${email}/carts/${cartId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("⚠️ Lỗi khi lấy giỏ hàng:", err);
        throw err;
    }
};



export const updateQuantity = async (cartId, productId, quantity) => {
    const token = getToken();
    try {
        const res = await axios.put(
            `${API_URL}/carts/${cartId}/products/${productId}/quantity/${quantity}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err) {
        console.error("⚠️ Lỗi khi cập nhật số lượng:", err);
        throw err;
    }
};

export const removeFromCart = async (cartId, productId) => {
    const token = getToken();
    try {
        const res = await axios.delete(`${API_URL}/carts/${cartId}/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error("⚠️ Lỗi khi xóa sản phẩm khỏi giỏ:", err);
        throw err;
    }
};
