// src/services/WishlistService.js

// Lấy wishlist từ localStorage
export const getWishlist = () => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
};

// Thêm sản phẩm vào wishlist
export const addToWishlist = (product) => {
    const wishlist = getWishlist();
    // Tránh thêm trùng
    if (!wishlist.find(item => item.productId === product.productId)) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
};

// Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = (productId) => {
    const wishlist = getWishlist();
    const newList = wishlist.filter(item => item.productId !== productId);
    localStorage.setItem("wishlist", JSON.stringify(newList));
};

// Kiểm tra sản phẩm có trong wishlist không
export const isInWishlist = (productId) => {
    const wishlist = getWishlist();
    return wishlist.some(item => item.productId === productId);
};
