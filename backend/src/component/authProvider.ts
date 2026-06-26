import { AuthProvider } from "react-admin";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Chuẩn ESM import

interface LoginParams {
    username: string;
    password: string;
}

interface JwtPayload {
    sub?: string;       // email
    email?: string;
    roles?: string[];   // ["Role(id=101, roleName=ROLE_ADMIN)"]
    iat?: number;
    exp?: number;
}

export const authProvider: AuthProvider = {
    // 🔐 Đăng nhập
    login: async ({ username, password }: LoginParams) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/login",
                { email: username, password },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );

            const token = response.data["jwt-token"];
            if (!token) throw new Error("Không nhận được token từ server.");

            // 🔹 Decode JWT
            const decoded: JwtPayload = jwtDecode(token);

            // 🔹 Extract roleName từ string kiểu "Role(id=101, roleName=ROLE_ADMIN)"
            const roles = decoded.roles?.map(r => {
                const match = r.match(/roleName=([A-Z_]+)/);
                return match ? match[1] : r;
            }) || [];

            console.log("Mapped roles:", roles);

            // 🔒 Chỉ cho phép ADMIN login
            if (!roles.includes("ROLE_ADMIN")) {
                return Promise.reject(new Error("Bạn không có quyền truy cập admin."));
            }

            // 🔹 Lưu token & roles
            localStorage.setItem("jwt-token", token);
            localStorage.setItem("userEmail", username);
            localStorage.setItem("userRoles", JSON.stringify(roles));

            return Promise.resolve();

        } catch (error: any) {
            console.error("Axios error:", error.response?.data || error.message);
            return Promise.reject(new Error("Sai tài khoản hoặc mật khẩu hoặc không có quyền."));
        }
    },

    // 🚪 Đăng xuất
    logout: () => {
        localStorage.removeItem("jwt-token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRoles");
        return Promise.resolve();
    },

    // ❌ Kiểm tra lỗi auth
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("jwt-token");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRoles");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    // 🔎 Kiểm tra trạng thái đăng nhập
    checkAuth: () => {
        const token = localStorage.getItem("jwt-token");
        const rolesStr = localStorage.getItem("userRoles");

        if (!token || !rolesStr) return Promise.reject();

        const roles: string[] = JSON.parse(rolesStr);

        // Chỉ cho ADMIN truy cập
        if (!roles.includes("ROLE_ADMIN")) {
            return Promise.reject(new Error("Bạn không có quyền truy cập admin."));
        }

        return Promise.resolve();
    },

    // 🔓 Lấy quyền (roles)
    getPermissions: () => {
        const rolesStr = localStorage.getItem("userRoles");
        if (!rolesStr) return Promise.reject();
        return Promise.resolve(JSON.parse(rolesStr)); // React Admin nhận mảng string roles
    },
};
