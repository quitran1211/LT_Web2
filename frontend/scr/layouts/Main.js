import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../layouts/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import UpdateProfile from "../pages/profile/UpdateProfile";
import ProductDetail from "../pages/product/ProductDetail";
import Category from "../pages/category/Category";
import ProductPage from "../pages/product/ProductPage";
import Profile from "../pages/profile/Profile";
import UpdateAddress from "../pages/profile/UpdateAddress";
import CartPage from "../pages/cart/CartPage";
import Checkout from "../pages/order/Checkout";
import StorePage from "../pages/store/StorePage";

const Main = () => (
    <main className="my-4">
        <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/category" element={<Category />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route path="/update-address/:id" element={<UpdateAddress />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<StorePage />} />
            </Routes>
        </div>
    </main>
);

export default Main;
