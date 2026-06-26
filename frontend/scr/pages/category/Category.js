import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../services/CategoryService";
import { getFilteredProducts } from "../../services/ProductService";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                const catData = await getAllCategories();
                setCategories(catData);

                // Lấy tất cả sản phẩm
                const prodData = await getFilteredProducts({}); // Lấy tất cả sản phẩm
                const products = prodData.content || prodData;

                // Nhóm sản phẩm theo categoryId
                const grouped = {};
                products.forEach((p) => {
                    const catId = p.category?.id;
                    if (catId) {
                        if (!grouped[catId]) grouped[catId] = [];
                        grouped[catId].push(p);
                    }
                });
                setProductsByCategory(grouped);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            }
        };

        fetchCategoriesAndProducts();
    }, []);

    const getRandomBgColor = () => {
        const colors = ["#ffd7d7", "#FFF68D", "#d0f0c0", "#b0e0e6", "#f4c2c2"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    {categories.map((cat) => (
                        <div className="col-md-3 mb-4" key={cat.id}>
                            <div className="card card-category h-100 shadow-sm">
                                {/* Background gradient */}
                                <div
                                    className="img-wrap d-flex align-items-center justify-content-center"
                                    style={{
                                        background: "#bf6139",
                                        height: "150px",
                                        borderTopLeftRadius: "0.25rem",
                                        borderTopRightRadius: "0.25rem",
                                    }}
                                >
                                    {/* Icon category */}
                                    <i className="fas fa-coffee fa-2x" style={{ color: "#2b150b" }} ></i>
                                </div>

                                <div className="card-body">
                                    <h4 className="card-title">
                                        <a
                                            href={`/product?categoryId=${cat.id}`}
                                            className="text-dark"
                                            style={{ fontWeight: "600" }}
                                        >
                                            {cat.categoryName}
                                        </a>
                                    </h4>

                                    {productsByCategory[cat.id] && productsByCategory[cat.id].length > 0 && (
                                        <ul className="list-menu" style={{ maxHeight: "150px", overflowY: "auto" }}>
                                            {productsByCategory[cat.id].map((p) => (
                                                <li key={p.productId}>
                                                    <a href={`/product/${p.productId}`}>{p.productName}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </section>
    );
};

export default Category;
