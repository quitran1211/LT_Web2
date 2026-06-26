import axios from "axios";

// ✅ Cấu hình base URL cho API category (thay đúng URL backend của bạn)
const API_URL = "http://localhost:8080/api/public/categories";

// 🧩 Hàm lấy tất cả danh mục
export const getAllCategories = async () => {
    try {
        const res = await axios.get(API_URL);
        return res.data.content || res.data; // Tùy backend trả về có .content hay không
    } catch (err) {
        console.error("Lỗi khi lấy danh sách danh mục:", err);
        throw err;
    }
};

// 🧩 Hàm lấy chi tiết 1 danh mục theo ID (nếu cần)
export const getCategoryById = async (categoryId) => {
    try {
        const res = await axios.get(`${API_URL}/${categoryId}`);
        return res.data;
    } catch (err) {
        console.error(`Lỗi khi lấy danh mục ID = ${categoryId}:`, err);
        throw err;
    }
};
