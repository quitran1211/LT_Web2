// src/pages/profile/UpdateAddress.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/AuthService";

const UpdateAddress = () => {
    const { id } = useParams(); // addressId từ URL
    const navigate = useNavigate();

    const [form, setForm] = useState({
        buildingName: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const token = getToken();
                const res = await axios.get(`http://localhost:8080/api/addresses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("📌 Địa chỉ nhận được:", res.data);
                setForm({ ...res.data });
            } catch (err) {
                console.error("⚠️ Lấy địa chỉ thất bại:", err);
                alert("Không tìm thấy địa chỉ");
                window.location.href = "/profile";
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, [id, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = getToken();
            const res = await axios.put(
                `http://localhost:8080/api/addresses/${id}`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // ✅ Cập nhật lại localStorage
            const stored = JSON.parse(localStorage.getItem("addresses")) || [];
            const updated = stored.map(addr => addr.id === id ? res.data : addr);
            localStorage.setItem("addresses", JSON.stringify(updated));
            console.log("📌 Cập nhật thành công:", res.data);
            alert("Cập nhật địa chỉ thành công!");
            window.location.href = "/profile";
        } catch (err) {
            console.error("⚠️ Cập nhật thất bại:", err);
            alert("Cập nhật thất bại!");
        }
    };

    const handleCancel = () => {
        navigate("/profile");
    };

    if (loading) return <p>Loading...</p>;

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <main className="col-md-9">
                        <article className="card mb-4 p-3">
                            <h5>Update Address</h5>

                            <label>Building Name</label>
                            <input
                                type="text"
                                name="buildingName"
                                className="form-control mb-2"
                                value={form.buildingName}
                                onChange={handleChange}
                            />

                            <label>Street</label>
                            <input
                                type="text"
                                name="street"
                                className="form-control mb-2"
                                value={form.street}
                                onChange={handleChange}
                            />

                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                className="form-control mb-2"
                                value={form.city}
                                onChange={handleChange}
                            />

                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                className="form-control mb-2"
                                value={form.state}
                                onChange={handleChange}
                            />

                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                className="form-control mb-2"
                                value={form.country}
                                onChange={handleChange}
                            />

                            <label>Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                className="form-control mb-2"
                                value={form.pincode}
                                onChange={handleChange}
                            />

                            <div>
                                <button className="btn btn-primary me-2" onClick={handleSave}>
                                    Save
                                </button>
                                <button className="btn btn-secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        </article>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default UpdateAddress;
