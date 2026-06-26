import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../services/ProductService";
import { addToCart } from "../../services/CartService";
import { getUser } from "../../services/AuthService";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../services/WishlistService";

const PAGE_SIZE = 4;
const VietCoffee = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const user = getUser();
    const CATEGORY_FILTER = "Cà phê Việt Nam";

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts({ page: 1, limit: 1000 }); // lấy tất cả
            const filtered = Array.isArray(data)
                ? data.filter((item) => item.category?.categoryName === CATEGORY_FILTER)
                : [];
            setAllProducts(filtered);
            setVisibleProducts(filtered.slice(0, PAGE_SIZE)); // hiển thị 4 sản phẩm đầu tiên
        } catch (error) {
            console.error("❌ Lỗi khi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        setWishlist(getWishlist());
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        const start = page * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        setVisibleProducts((prev) => [
            ...prev,
            ...allProducts.slice(start, end)
        ]);
        setPage(nextPage);
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

    const handleToggleWishlist = (product) => {
        const exists = wishlist.find((p) => p.productId === product.productId);
        if (exists) removeFromWishlist(product.productId);
        else addToWishlist(product);
        setWishlist(getWishlist());
    };

    const isInWishlist = (productId) => wishlist.some((p) => p.productId === productId);

    if (loading) return <div className="text-center p-5">⏳ Đang tải...</div>;
    if (!visibleProducts.length) return <div className="text-center p-5">Không có sản phẩm nào.</div>;

    return (
        <section className="padding-bottom">
            <header className="section-heading mb-4">
                <h3 className="title-section">Thức uống đậm chất Việt</h3>
            </header>

            <div className="row">
                {visibleProducts.map((item) => (
                    <div key={item.productId} className="col-xl-3 col-lg-3 col-md-4 col-6 mb-4">
                        <div className="card card-product-grid shadow-sm border-0 h-100">
                            <Link to={`/product/${item.productId}`} className="img-wrap">
                                <img
                                    src={`http://localhost:8080/api/public/products/image/${item.image}`}
                                    alt={item.productName}
                                    style={{
                                        width: "100%",
                                        height: "280px",
                                        objectFit: "cover",
                                        borderTopLeftRadius: "0.5rem",
                                        borderTopRightRadius: "0.5rem",
                                    }}
                                />
                            </Link>

                            <figcaption className="info-wrap p-3 d-flex flex-column justify-content-between">
                                <div>
                                    <Link
                                        to={`/category/${item.category?.categoryId}`}
                                        className="text-muted small"
                                    >
                                    </Link>
                                    <Link
                                        to={`/product/${item.productId}`}
                                        className="title d-block text-dark fw-semibold mt-1"
                                    >
                                        {item.productName}
                                    </Link>
                                </div>

                                <div className="price h5 mt-2 mb-3">
                                    {item.specialPrice && item.specialPrice < item.price ? (
                                        <>
                                            <span className="text-danger fw-bold">
                                                {item.specialPrice.toLocaleString("vi-VN")} ₫
                                            </span>{" "}
                                            <del className="text-muted small">{item.price.toLocaleString("vi-VN")} ₫</del>
                                        </>
                                    ) : (
                                        <span>{item.price.toLocaleString("vi-VN")} ₫</span>
                                    )}
                                </div>

                                <div className="d-flex justify-content-end gap-2">
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

            {visibleProducts.length < allProducts.length && (
                <div className="text-center mt-3">
                    <button
                        className="btn"
                        style={{
                            color: "#6B2B10",
                            border: "2px solid #6B2B10",
                            backgroundColor: "transparent",
                        }}
                        onClick={handleLoadMore}
                    >
                        Xem thêm
                    </button>

                </div>
            )}
        </section>
    );
};
export default VietCoffee;
