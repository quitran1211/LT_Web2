import React, { useState, useEffect } from "react";
import { getUser, logout } from "../../services/AuthService";
import ProfileSidebar from "./ProfileSidebar";
import OverviewTab from "./OverviewTab";
import AddressTab from "./AddressTab";
import OrderTab from "./OrderTab";
import WishlistTab from "./WishlistTab";
// import các tab khác

const Profile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        window.location.href = "/";
    };

    if (!user) return <p style={{ textAlign: "center", height: "250px" }}>Bạn chưa đăng nhập</p>;

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview": return <OverviewTab user={user} />;
            case "address": return <AddressTab user={user} />;
            case "order": return <OrderTab user={user} />
            case "wishlist": return <WishlistTab />

            // các tab khác
            default: return null;
        }
    };

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
                    <main className="col-md-9">{renderTabContent()}</main>
                </div>
            </div>
        </section>
    );
};

export default Profile;
