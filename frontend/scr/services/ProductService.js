import axios from "axios";

// ✅ Cấu hình base URL cho backend
const API_URL = "http://localhost:8080/api/public/products";

// 🧩 Hàm lấy tất cả sản phẩm
export const getAllProducts = async () => {
    try {
        const res = await axios.get(API_URL);
        return res.data.content;
    } catch (err) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", err);
        throw err;
    }
};

// 🧩 Hàm lấy chi tiết 1 sản phẩm theo ID
export const getProductById = async (productId) => {
    try {
        const res = await axios.get(`${API_URL}/${productId}`);
        return res.data;
    } catch (err) {
        console.error(`Lỗi khi lấy sản phẩm ID = ${productId}:`, err);
        throw err;
    }
};

// 🧩 (Tùy chọn) Hàm tìm kiếm sản phẩm theo tên
export const searchProducts = async (keyword) => {
    try {
        const res = await axios.get(`${API_URL}/search?keyword=${keyword}`);
        return res.data;
    } catch (err) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", err);
        throw err;
    }
};
// Lấy sản phẩm theo categoryId
export const getProductsByCategory = async (categoryId) => {
    try {
        const res = await axios.get(`${API_URL}?categoryId=${categoryId}`);
        return res.data.content; // giả sử backend trả về paged content
    } catch (err) {
        console.error("Lỗi khi lấy sản phẩm theo category:", err);
        throw err;
    }
};
// 🧩 Hàm lấy sản phẩm có lọc
export const getFilteredProducts = async (filters = {}) => {
    try {
        const params = {};

        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.search) params.search = filters.search;
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.sortOrder) params.sortOrder = filters.sortOrder;

        const res = await axios.get(API_URL, { params });
        return res.data.content || res.data; // tùy backend trả về kiểu gì
    } catch (err) {
        console.error("❌ Lỗi khi lọc sản phẩm:", err);
        throw err;
    }
};


