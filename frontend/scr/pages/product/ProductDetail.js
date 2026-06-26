import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/ProductService";
import { getUser } from "../../services/AuthService";
import { addToCart } from "../../services/CartService";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../services/WishlistService";

const ProductDetail = () => {
    const { id } = useParams(); // Lấy productId từ URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);

    const user = getUser(); // Lấy thông tin user + cartId

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();

        // Load wishlist từ localStorage
        setWishlist(getWishlist());
    }, [id]);

    const isInWishlist = (productId) => wishlist.some((p) => p.productId === productId);

    const handleToggleWishlist = (product) => {
        const exists = isInWishlist(product.productId);
        if (exists) {
            removeFromWishlist(product.productId);
            setWishlist(getWishlist());
            alert(`${product.productName} đã xóa khỏi yêu thích`);
        } else {
            addToWishlist(product);
            setWishlist(getWishlist());
            alert(`${product.productName} đã thêm vào yêu thích`);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const cartId = user?.cart?.cartId;
            if (!cartId) {
                alert("Không tìm thấy giỏ hàng của bạn!");
                return;
            }

            await addToCart(cartId, product.productId, 1);
            alert(`Đã thêm ${product.productName} vào giỏ hàng!`);
        } catch (err) {
            console.error("⚠️ Lỗi khi thêm vào giỏ:", err.response?.data || err.message);
            alert("Lỗi khi thêm sản phẩm vào giỏ!");
        }
    };

    if (loading) return <div className="text-center p-5">⏳ Đang tải...</div>;
    if (!product) return <div className="text-center p-5 text-danger">Không tìm thấy sản phẩm!</div>;

    return (
        <section className="section-name padding-y bg">
            <div className="container">
                <div className="row">
                    {/* Bên trái: Mô tả sản phẩm */}
                    <div className="col-md-8">
                        <h3 className="mb-3">{product.productName}</h3>

                        <img
                            src={`http://localhost:8080/api/public/products/image/${product.image}`}
                            alt={product.productName}
                            style={{ maxHeight: "500px", objectFit: "cover" }}
                        />

                        <h5 className="title-description">Mô tả sản phẩm</h5>
                        <p>{product.description || "Không có mô tả cho sản phẩm này."}</p>

                        <h5 className="title-description">Thông tin chi tiết</h5>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th>Tên sản phẩm</th>
                                    <td>{product.productName}</td>
                                </tr>
                                <tr>
                                    <th>Danh mục</th>
                                    <td>{product.category?.categoryName || "Chưa phân loại"}</td>
                                </tr>
                                <tr>
                                    <th>Giá</th>
                                    <td className="text-danger">
                                        {product.specialPrice && product.specialPrice < product.price ? (
                                            <>
                                                {product.specialPrice.toLocaleString("vi-VN")} ₫{" "}
                                                <del className="text-muted">{product.price.toLocaleString("vi-VN")} ₫</del>
                                            </>
                                        ) : (
                                            <span>{product.price.toLocaleString("vi-VN")} ₫</span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Số lượng còn lại</th>
                                    <td>{product.quantity || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Bên phải: hành động */}
                    <aside className="col-md-4">
                        <div className="box p-3 shadow-sm bg-white rounded">
                            <h5 className="title-description mb-3">Thông tin mua hàng</h5>

                            <h4 className="text-danger mb-3">
                                {product.specialPrice && product.specialPrice < product.price ? (
                                    <>
                                        {product.specialPrice.toLocaleString("vi-VN")} ₫{" "}
                                        <del className="text-muted">{product.price.toLocaleString("vi-VN")} ₫</del>
                                    </>
                                ) : (
                                    <span>{product.price.toLocaleString("vi-VN")} ₫</span>
                                )}
                            </h4>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary flex-grow-1 mr-2"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                                <button
                                    className="btn btn-light"
                                    onClick={() => handleToggleWishlist(product)}
                                >
                                    <i className={`fa fa-heart ${isInWishlist(product.productId) ? "text-danger" : "text-muted"}`}></i>
                                </button>
                            </div>

                            <hr />
                            <p className="text-muted small">
                                <strong>Danh mục:</strong> {product.category?.categoryName || "N/A"}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
