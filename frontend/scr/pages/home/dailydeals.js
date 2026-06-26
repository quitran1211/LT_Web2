import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyDeals = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/public/products");
                const data = res.data.content || res.data;

                // Lọc sản phẩm có discount > 0
                const saleProducts = data.filter((p) => p.discount && p.discount > 0);

                setProducts(saleProducts);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm giảm giá:", err);
            }
        };

        fetchSaleProducts();
    }, []);

    const formatPrice = (price) => price.toLocaleString("vi-VN") + " ₫";

    return (
        <section className="padding-bottom">
            {/* <header className="section-heading mb-4">
                <h3 className="title-section">Giảm giá mỗi ngày</h3>
            </header>

            <div className="row row-sm">
                {products.length > 0 ? (
                    products.map((item) => (
                        <div key={item.productId} className="col-xl-2 col-lg-3 col-md-4 col-6">
                            <div className="card card-sm card-product-grid">
                                <a href="#" className="img-wrap">
                                    <b className="badge badge-danger mr-1">{item.discount}% OFF</b>
                                    <img
                                        src={`http://localhost:8080/api/public/products/image/${item.image}`}
                                        alt={item.productName}
                                        style={{ width: "100%", height: "150px", objectFit: "cover" }}
                                    />
                                </a>
                                <figcaption className="info-wrap">
                                    <a href="#" className="title">{item.productName}</a>
                                    <div className="price-wrap">
                                        <span className="price text-danger">{formatPrice(item.specialPrice)}</span>
                                        <del className="price-old text-muted">{formatPrice(item.price)}</del>
                                    </div>
                                </figcaption>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">Không có sản phẩm giảm giá hôm nay.</p>
                )}
            </div> */}

            <section className="padding-bottom">
                <article className="box d-flex flex-wrap align-items-center p-5 "
                    style={{ backgroundColor: "#431603" }}

                >
                    <div className="text-white mr-auto">
                        <h3>Tìm kiếm thêm sản phẩm?</h3>
                        <p>Thức uống đặc biệt, thức uống bán chạy và miễn phí giao hàng</p>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <a href="/product" className="btn btn-outline-light">Xem thêm</a>
                    </div>
                </article>
            </section>
        </section>
    );
};

export default DailyDeals;
