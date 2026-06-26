import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const register = (data) => {
    console.log("REGISTER DATA", data);
    return axios.post(`${API_URL}/register`, data, {
        validateStatus: (status) => status >= 200 && status < 300 // mọi 2xx đều success
    });
};


export const login = async (data) => {
    console.log("LOGIN DATA:", data);

    const response = await axios.post(`${API_URL}/login`, data);
    const token = response.data.token || response.data["jwt-token"];
    console.log("Token nhận được:", token);

    // ✅ Lưu token
    localStorage.setItem("token", token);

    // ✅ Gọi API để lấy thông tin user bằng email
    const userResponse = await axios.get(`${API_URL}/public/users/email/${data.email}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log("User response:", userResponse.data);

    // ✅ Lưu user vào localStorage
    localStorage.setItem("user", JSON.stringify(userResponse.data));

    return { token, user: userResponse.data };
};

// ✅ Lấy token
export const getToken = () => {
    return localStorage.getItem("token");
};

// ✅ Xóa token + user khi logout
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// ✅ Lấy thông tin user
export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const updateUser = async (data) => {
    const token = getToken();
    const user = getUser();

    // Lấy userId từ localStorage
    const userId = user?.userId || user?.id;
    if (!userId) {
        throw new Error("Không tìm thấy thông tin người dùng trong localStorage");
    }

    // Tạo payload chỉ gồm các trường thuộc user
    const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        email: data.email,
    };

    console.log("📤 Payload gửi đi:", payload);

    // Gọi API PUT
    const res = await axios.put(`${API_URL}/public/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });

    // Cập nhật lại localStorage
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
};

