// ProfileSidebar.jsx
import React from "react";

const ProfileSidebar = ({ activeTab, setActiveTab, handleLogout }) => (
    <aside className="col-md-3">
        <nav className="list-group" >
            <button
                className={`list-group-item text-start ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
                style={{ textAlign: "left" }}
            >
                Tổng quan tài khoản
            </button>
            <button
                className={`list-group-item text-start ${activeTab === "address" ? "active" : ""}`}
                onClick={() => setActiveTab("address")}
                style={{ textAlign: "left" }}
            >
                Địa chỉ
            </button>
            <button
                className={`list-group-item ${activeTab === "order" ? "active" : ""}`}
                onClick={() => setActiveTab("order")}
                style={{ textAlign: "left" }}
            >
                Đơn hàng
            </button>
            <button
                className={`list-group-item ${activeTab === "wishlist" ? "active" : ""}`}
                onClick={() => setActiveTab("wishlist")}
                style={{ textAlign: "left" }}
            >
                Danh sách yêu thích
            </button>

        </nav>
    </aside>
);

export default ProfileSidebar;
