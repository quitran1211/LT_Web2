import React, { useEffect, useState } from "react";
import { getFilteredProducts } from "../../services/ProductService";
import { getAllCategories } from "../../services/CategoryService";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../services/WishlistService";
import { addToCart } from "../../services/CartService";
const ProductPage = () => {
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [filters, setFilters] = useState({
        categoryId: "",
        minPrice: 0,
        maxPrice: 10000000,
        onSale: false,
        keyword: "",
    });
    const [priceRange, setPriceRange] = useState([0, 10000000]);

    const removeVietnameseTones = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    const handleAddToCart = async (product) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            console.log("USER:", user);

            const cartId = user?.cart?.cartId;

            if (!cartId) {
                alert("Không tìm thấy giỏ hàng");
                return;
            }

            await addToCart(cartId, product.productId, 1);

            alert(`Đã thêm ${product.productName} vào giỏ hàng`);
        } catch (error) {
            console.error(error);
            alert("Không thể thêm sản phẩm vào giỏ hàng");
        }
    };

    const handleToggleWishlist = (product) => {
        const exists = wishlist.find(p => p.productId === product.productId);
        if (exists) {
            removeFromWishlist(product.productId);
            setWishlist(getWishlist());
        } else {
            addToWishlist(product);
            setWishlist(getWishlist());
        }
    };

    const isInWishlist = (productId) => wishlist.some(p => p.productId === productId);

    useEffect(() => {
        const fetchCategories = async () => {
            const catData = await getAllCategories();
            setCategories(catData);
        };
        fetchCategories();

        const fetchProducts = async () => {
            const data = await getFilteredProducts({ categoryId: "", minPrice: 0, maxPrice: 10000000 });
            const productsData = data.content || data;
            setAllProducts(productsData);
            setProducts(productsData);

            const prices = productsData.map(p => p.specialPrice && p.specialPrice > 0 ? p.specialPrice : p.price);
            const maxPrice = Math.max(...prices);

            setFilters(prev => ({ ...prev, minPrice: 0, maxPrice }));
            setPriceRange([0, maxPrice]);
        };
        fetchProducts();

        // Load wishlist từ localStorage
        setWishlist(getWishlist());
    }, []);

    useEffect(() => {
        let filtered = [...allProducts];

        if (filters.categoryId) {
            filtered = filtered.filter(p => p.category?.categoryId === filters.categoryId);
        }

        filtered = filtered.filter(p => {
            const price = p.specialPrice && p.specialPrice > 0 ? p.specialPrice : p.price;
            return price >= filters.minPrice && price <= filters.maxPrice;
        });

        if (filters.onSale) {
            filtered = filtered.filter(p => p.discount > 0);
        }

        if (filters.keyword.trim() !== "") {
            const keywordNormalized = removeVietnameseTones(filters.keyword.toLowerCase());
            filtered = filtered.filter(p => {
                const nameNormalized = removeVietnameseTones(p.productName.toLowerCase());
                return nameNormalized.includes(keywordNormalized);
            });
        }

        setProducts(filtered);
    }, [filters, allProducts]);

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <aside className="col-md-3">
                        <article className="filter-group mb-3">
                            <h6 className="title">Tìm kiếm</h6>
                            <div className="filter-content show">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập từ khóa..."
                                    value={filters.keyword}
                                    onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                                />
                            </div>
                        </article>

                        <article className="filter-group">
                            <h6 className="title">Danh mục</h6>
                            <div className="filter-content show">
                                <div className="inner">
                                    <div className="mb-2 p-2 border rounded bg-light">
                                        <strong>Đang lọc:</strong>{" "}
                                        {filters.categoryId
                                            ? categories.find(cat => cat.id === filters.categoryId)?.categoryName
                                            : "Tất cả"}
                                    </div>

                                    <ul className="list-menu">
                                        <li>
                                            <a
                                                href="#"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setFilters(prev => ({ ...prev, categoryId: "" }));
                                                }}
                                            >
                                                Tất cả
                                            </a>
                                        </li>
                                        {categories.map(cat => (
                                            <li key={cat.id}>
                                                <a
                                                    href="#"
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setFilters(prev => ({ ...prev, categoryId: cat.id }));
                                                    }}
                                                >
                                                    {cat.categoryName}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </article>

                        <article className="filter-group mt-4">
                            <h6 className="title">Khuyến mãi</h6>
                            <div className="filter-content show">
                                <div className="inner">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={filters.onSale}
                                            onChange={() => setFilters(prev => ({ ...prev, onSale: !prev.onSale }))}
                                        />{" "}
                                        Chỉ sản phẩm đang giảm giá
                                    </label>
                                </div>
                            </div>
                        </article>

                        <article className="filter-group mt-4">
                            <h6 className="title">Khoảng giá</h6>
                            <div className="filter-content show">
                                <div className="inner">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>{filters.minPrice.toLocaleString("vi-VN")} ₫</span>
                                        <span>{filters.maxPrice.toLocaleString("vi-VN")} ₫</span>
                                    </div>
                                    <Slider
                                        range
                                        min={priceRange[0]}
                                        max={priceRange[1]}
                                        allowCross={false}
                                        value={[filters.minPrice, filters.maxPrice]}
                                        onChange={vals => setFilters(prev => ({ ...prev, minPrice: vals[0], maxPrice: vals[1] }))}
                                    />
                                </div>
                            </div>
                        </article>
                    </aside>

                    <main className="col-md-9">
                        <header className="mb-3 d-flex justify-content-between align-items-center">
                            <strong>{products.length} sản phẩm được tìm thấy</strong>
                        </header>

                        <div className="row">
                            {products.map(item => (
                                <div key={item.productId} className="col-xl-4 col-lg-4 col-md-6 col-6 mb-4">
                                    <div className="card card-product-grid">
                                        <a href={`/product/${item.productId}`} className="img-wrap">
                                            <img
                                                src={`http://localhost:8080/api/public/products/image/${item.image}`}
                                                alt={item.productName}
                                                style={{ width: "100%", height: "250px", objectFit: "cover" }}
                                            />
                                        </a>
                                        <figcaption className="info-wrap">
                                            <div>
                                                <a href={`/product/${item.productId}`} className="title d-block">{item.productName}</a>
                                                <span className="text-muted small">{item.category?.categoryName}</span>
                                            </div>
                                            <div className="price h6 mt-2">
                                                {item.specialPrice && item.specialPrice < item.price ? (
                                                    <>
                                                        <span className="text-danger">{item.specialPrice.toLocaleString("vi-VN")} ₫</span>{" "}
                                                        <del className="text-muted">{item.price.toLocaleString("vi-VN")} ₫</del>
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
                                                    <i className={`fa fa-heart ${isInWishlist(item.productId) ? "text-danger" : "text-muted"}`}></i>
                                                </button>

                                                <button
                                                    className="btn btn-primary"
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
                    </main>
                </div>
            </div>
        </section>
    );
};

export default ProductPage;
