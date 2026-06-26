import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNotify, useRedirect } from "react-admin";
import axios from "axios";
import "../component/css/ProductImageUpdate.css"; // CSS riêng

const ProductImageUpdate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const notify = useNotify();
    const redirect = useRedirect();
    const token = localStorage.getItem("jwt-token");

    // Xử lý khi chọn file ảnh
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    // Gửi request upload ảnh
    const handleUpload = async () => {
        if (!file) {
            notify("Vui lòng chọn ảnh trước khi cập nhật.", { type: "warning" });
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            await axios.put(`http://localhost:8080/api/admin/products/${id}/image`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            notify("Cập nhật ảnh thành công!", { type: "success" });
            redirect("/products");
        } catch (error) {
            console.error(error);
            notify("Lỗi khi cập nhật ảnh.", { type: "error" });
        }
    };

    return (
        <div className="image-update-container">
            <h2>Cập nhật hình ảnh cho sản phẩm ID: {id}</h2>

            <div className="image-preview">
                {preview ? (
                    <img src={preview} alt="Preview" className="preview-img" />
                ) : (
                    <p>Chưa có hình ảnh được chọn</p>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
            />

            <button onClick={handleUpload} className="update-button">
                Cập nhật
            </button>
        </div>
    );
};

export default ProductImageUpdate;
