import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUser } from "../../services/AuthService";
import { addToCart } from "../../services/CartService";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../services/WishlistService";

const PAGE_SIZE = 4; // Số sản phẩm hiển thị mỗi lần

const ProductSale = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const user = getUser();

    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:8080/api/public/products");
                const data = res.data.content || res.data;
                const saleProducts = Array.isArray(data)
                    ? data.filter((p) => p.specialPrice && p.specialPrice < p.price)
                    : [];
                setAllProducts(saleProducts);
                setVisibleProducts(saleProducts.slice(0, PAGE_SIZE));
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm giảm giá:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSaleProducts();
        setWishlist(getWishlist());
    }, []);

    const isInWishlist = (productId) => wishlist.some((p) => p.productId === productId);

    const handleToggleWishlist = (product) => {
        if (isInWishlist(product.productId)) {
            removeFromWishlist(product.productId);
        } else {
            addToWishlist(product);
        }
        setWishlist(getWishlist());
    };

    const handleAddToCart = async (product) => {
        try {
            const cartId = user?.cart?.cartId;
            if (!cartId) return alert("Không tìm thấy giỏ hàng của bạn!");
            await addToCart(cartId, product.productId, 1);
            alert(`Đã thêm ${product.productName} vào giỏ hàng!`);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi thêm sản phẩm vào giỏ!");
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        const start = page * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        setVisibleProducts((prev) => [...prev, ...allProducts.slice(start, end)]);
        setPage(nextPage);
    };

    if (loading) return <div className="text-center p-5">⏳ Đang tải...</div>;
    if (!visibleProducts.length) return <div className="text-center p-5">Không có sản phẩm giảm giá.</div>;

    return (
        <section className="padding-bottom">
            <header className="section-heading mb-4">
                <h3 className="title-section">Sản phẩm đang giảm giá</h3>
            </header>
            <div className="row">
                {visibleProducts.map((item) => (
                    <div key={item.productId} className="col-xl-3 col-lg-3 col-md-4 col-6 mb-4">
                        <div className="card card-product-grid">
                            <a href="#" className="img-wrap">
                                <b className="badge badge-danger mr-1">{item.discount}% OFF</b>
                                <img
                                    src={`http://localhost:8080/api/public/products/image/${item.image}`}
                                    alt={item.productName}
                                    style={{ width: "100%", height: "280px", objectFit: "cover" }}
                                />
                            </a>
                            <figcaption className="info-wrap">
                                <div>
                                    <a href="#" className="title d-block">
                                        {item.productName}
                                    </a>
                                </div>
                                <div className="price h5 mt-2">
                                    <span className="text-danger">
                                        {item.specialPrice.toLocaleString("vi-VN")} ₫
                                    </span>{" "}
                                    <del className="text-muted">
                                        {item.price.toLocaleString("vi-VN")} ₫
                                    </del>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-2">
                                    <button
                                        className="btn btn-light mr-2"
                                        onClick={() => handleToggleWishlist(item)}
                                    >
                                        <i
                                            className={`fa fa-heart ${isInWishlist(item.productId) ? "text-danger" : "text-muted"}`}
                                        ></i>
                                    </button>

                                    <button
                                        className="btn"
                                        style={{
                                            backgroundColor: "#6B2B10",
                                            borderColor: "#6B2B10",
                                            color: "#fff",
                                        }}
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </figcaption>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nút Xem thêm */}
            {visibleProducts.length < allProducts.length && (
                <div className="text-center mt-3">
                    <button className="btn"
                        style={{
                            color: "#6B2B10",
                            border: "2px solid #6B2B10",
                            backgroundColor: "transparent",
                        }}
                        onClick={handleLoadMore}>
                        Xem thêm
                    </button>
                </div>
            )}
        </section>
    );
};

export default ProductSale;
