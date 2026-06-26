// AddressTab.jsx
import React from "react";

const AddressTab = ({ user }) => {
    const { address } = user; // lấy địa chỉ giống OverviewTab

    return (
        <article className="card mb-3">
            <div className="card-body" style={{ fontSize: "18px" }}>
                {address ? (
                    <article className="box mb-4">
                        <h6>{address.city}, {address.country}</h6>
                        <p>
                            Building: {address.buildingName} <br />
                            Street: {address.street} <br />
                            State: {address.state} <br />
                            Pincode: {address.pincode}
                        </p>
                        <a href={`/update-address/${address.addressId}`} className="btn btn-light me-2">
                            <i className="fa fa-pen"></i> Edit
                        </a>
                    </article>
                ) : (
                    <p>Chưa có địa chỉ</p>
                )}
            </div>
        </article>
    );
};

export default AddressTab;
