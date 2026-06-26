import React, { useState } from "react";
import { updateUser, getUser } from "../../services/AuthService";

const UpdateProfile = () => {
    const currentUser = getUser();

    // 🧍‍♂️ Dữ liệu người dùng
    const [user, setUser] = useState({
        firstName: currentUser?.firstName || "",
        lastName: currentUser?.lastName || "",
        mobileNumber: currentUser?.mobileNumber || "",
        email: currentUser?.email || "",
        password: "", // thêm trường password nếu người dùng muốn đổi
    });

    // --- Sự kiện thay đổi ---
    const handleUserChange = (e) =>
        setUser({ ...user, [e.target.name]: e.target.value });

    // --- Cập nhật user ---
    const handleSaveUser = async () => {
        try {
            const payload = { ...user };
            // nếu không nhập mật khẩu => xóa để tránh lỗi encode null
            if (!payload.password) delete payload.password;

            await updateUser(payload);
            alert("✅ Cập nhật thông tin người dùng thành công!");
            window.location.href = "/profile";

        } catch (err) {
            console.error("❌ Lỗi cập nhật user:", err);
            alert("Không thể cập nhật thông tin người dùng!");
        }
    };

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">


                    <main className="col-md-9">
                        <div className="card mb-4">
                            <div className="card-header">Thông tin người dùng</div>
                            <div className="card-body">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={user.firstName}
                                            onChange={handleUserChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={user.lastName}
                                            onChange={handleUserChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={handleUserChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Mobile Number</label>
                                        <input
                                            type="text"
                                            name="mobileNumber"
                                            value={user.mobileNumber}
                                            onChange={handleUserChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>New Password (optional)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={user.password}
                                        onChange={handleUserChange}
                                        className="form-control"
                                        placeholder="Leave blank if you don't want to change"
                                    />
                                </div>

                                <button onClick={handleSaveUser} className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default UpdateProfile;
