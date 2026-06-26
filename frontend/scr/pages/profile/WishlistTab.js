import React, { useEffect, useState } from "react";
import { getUser } from "../../services/AuthService";
import { addToCart } from "../../services/CartService";
import { getWishlist, removeFromWishlist } from "../../services/WishlistService";

const WishlistTab = () => {
    const [wishlist, setWishlist] = useState([]);
    const user = getUser(); // Lấy thông tin user + cartId

    // Load wishlist từ localStorage
    useEffect(() => {
        setWishlist(getWishlist());
    }, []);

    const handleRemove = (productId) => {
        removeFromWishlist(productId);
        setWishlist(getWishlist());
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

    if (!wishlist.length) return <p>Wishlist đang trống.</p>;

    return (
        <article className="card">
            <div className="card-body">
                <div className="row">
                    {wishlist.map((product) => (
                        <div className="col-md-6" key={product.productId}>
                            <figure className="itemside mb-4">
                                <div className="aside">
                                    <img
                                        src={`http://localhost:8080/api/public/products/image/${product.image}`}
                                        className="border img-md"
                                        alt={product.productName}
                                    />
                                </div>
                                <figcaption className="info d-flex flex-column justify-content-between">
                                    <div>
                                        <a href="#" className="title">{product.productName}</a>
                                        <p className="price mb-2">
                                            {product.specialPrice && product.specialPrice < product.price
                                                ? <>
                                                    <span className="text-danger">{product.specialPrice.toLocaleString()}₫</span>{" "}
                                                    <del className="text-muted">{product.price.toLocaleString()}₫</del>
                                                </>
                                                : <span>{product.price.toLocaleString()}₫</span>
                                            }
                                        </p>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-primary btn-sm flex-grow-1 mr-2"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Thêm vào giỏ
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            title="Remove from wishlist"
                                            onClick={() => handleRemove(product.productId)}
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default WishlistTab;
