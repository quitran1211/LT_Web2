// OverviewTab.jsx
import React from "react";

const OverviewTab = ({ user }) => (
    <article className="card mb-3">
        <div className="card-body">
            <figure className="icontext">
                <div className="text">
                    <strong style={{ fontSize: "18px" }}>Họ tên: {user.firstName} {user.lastName}</strong> <br />
                    <p className="mb-2" style={{ fontSize: "18px" }}>Email: {user.email}</p>
                    <p className="mb-2" style={{ fontSize: "18px" }}>Số điện thoại: {user.mobileNumber}</p>

                    <a href="/update-profile" className="btn btn-light btn-sm" style={{ fontSize: "13px" }}>Sửa</a>
                </div>
            </figure>
            <hr />
            <p style={{ fontSize: "15px" }}>
                <i className="fa fa-map-marker text-muted" style={{ fontSize: "18px" }}></i> &nbsp; Địa chỉ của tôi: <br />
                {user.address
                    ? `${user.address.buildingName}, ${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.country}, ${user.address.pincode}`
                    : "Chưa có địa chỉ"} &nbsp;
            </p>
        </div>
    </article>
);

export default OverviewTab;
