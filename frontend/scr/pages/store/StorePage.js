import React from "react";

const StorePage = () => {
    return (
        <div className="container my-5">

            {/* --- Header --- */}
            <h1 className="mb-4 text-center" style={{ color: "#431603" }}>
                Cwis Coffee - Nơi trải nghiệm cà phê hoàn hảo
            </h1>

            {/* --- Giới thiệu cửa hàng --- */}
            <div className="mb-5">
                <p style={{ fontSize: "1.1rem", lineHeight: "1.7" }}>
                    Chào mừng bạn đến với <strong>Cwis Coffee</strong> – một không gian cà phê hiện đại, ấm cúng tại Thủ Đức, TP. Hồ Chí Minh.
                    Chúng tôi tự hào mang đến những ly cà phê rang xay tươi ngon, pha chế chuyên nghiệp, cùng với các loại đồ uống hiện đại như latte, matcha, chocolate nóng và smoothies trái cây.
                    Không gian cửa hàng được thiết kế để bạn thư giãn, làm việc, gặp gỡ bạn bè hoặc tổ chức các buổi họp nhỏ.
                </p>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.7" }}>
                    Tại <strong>Cwis Coffee</strong>, chất lượng luôn là ưu tiên hàng đầu. Chúng tôi lựa chọn những hạt cà phê Arabica và Robusta tốt nhất, rang xay tại chỗ để đảm bảo hương vị tươi mới và đậm đà trong từng tách cà phê.
                    Đội ngũ barista giàu kinh nghiệm sẽ tạo ra những ly cà phê hoàn hảo theo yêu cầu của bạn.
                </p>
            </div>

            {/* --- Thông tin cửa hàng --- */}
            <div className="row mb-5">
                <div className="col-md-6">
                    <h3 style={{ color: "#431603" }}>Thông tin cửa hàng</h3>
                    <p><strong>Tên cửa hàng:</strong> Cwis Coffee</p>
                    <p><strong>Địa chỉ:</strong> 20 Tăng Nhơn Phú, Phước Long B, Thủ Đức, TP. Hồ Chí Minh</p>
                    <p><strong>Giờ mở cửa:</strong> 7:00 AM - 10:00 PM (Thứ 2 - Chủ nhật)</p>
                </div>
                <div className="col-md-6">
                    <h3 style={{ color: "#431603" }}>Thông tin liên hệ</h3>
                    <p><strong>Email:</strong> <a href="mailto:info@cwiscoffee.vn">info@cwiscoffee.vn</a></p>
                    <p><strong>Số điện thoại:</strong> <a href="tel:0909123456">0909 123 456</a></p>
                    <p>
                        <strong>Fanpage:</strong>{" "}
                        <a href="https://www.facebook.com/iugigis1" target="_blank" rel="noreferrer">
                            facebook.com/cwiscoffee
                        </a>
                    </p>
                </div>
            </div>

            {/* --- Google Map --- */}
            <div className="mb-5">
                <h3 className="mb-3" style={{ color: "#431603" }}>Vị trí cửa hàng</h3>
                <div className="ratio ratio-16x9">
                    <iframe
                        title="Google Maps"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7463237616334!2d106.77247247451781!3d10.830715058191062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752701a34a5d5f%3A0x30056b2fdf668565!2zQ2FvIMSQ4bqzbmcgQ8O0bmcgVGjGsMahbmcgVFAuSENN!5e0!3m2!1svi!2s!4v1762693347851!5m2!1svi!2s"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            {/* --- Giá trị & trải nghiệm --- */}
            <div className="mb-5">
                <h3 style={{ color: "#431603" }}>Giá trị và trải nghiệm</h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.7" }}>
                    Chúng tôi luôn nỗ lực tạo ra trải nghiệm cà phê hoàn hảo cho khách hàng.
                    Không chỉ là thức uống, mỗi tách cà phê tại <strong>Cwis Coffee</strong> đều mang đến sự tinh tế, thoải mái và sự kết nối.
                    Chúng tôi tin rằng không gian đẹp, âm nhạc nhẹ nhàng và phục vụ chu đáo sẽ khiến mỗi khách hàng muốn quay lại nhiều lần.
                </p>
            </div>

            {/* --- Chính sách --- */}
            <div className="row mb-5">
                <div className="col-md-6 mb-4">
                    <div className="p-3 border rounded shadow-sm h-100">
                        <h4 style={{ color: "#431603" }}>Chính sách bảo mật</h4>
                        <p>
                            Chúng tôi cam kết bảo mật tất cả thông tin khách hàng. Dữ liệu cá nhân như email, số điện thoại, địa chỉ sẽ được sử dụng để phục vụ khách hàng và không được chia sẻ với bên thứ 3.
                        </p>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="p-3 border rounded shadow-sm h-100">
                        <h4 style={{ color: "#431603" }}>Chính sách hoàn tiền</h4>
                        <p>
                            Nếu sản phẩm gặp lỗi hoặc không đúng như mô tả, khách hàng có thể yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày nhận hàng. Vui lòng liên hệ hotline hoặc email để được hỗ trợ.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Thông tin hữu ích khác --- */}
            <div className="mb-5">
                <h3 style={{ color: "#431603" }}>Thông tin hữu ích</h3>
                <ul style={{ fontSize: "1.1rem", lineHeight: "1.7" }}>
                    <li>Hỗ trợ tư vấn chọn cà phê phù hợp với khẩu vị cá nhân.</li>
                    <li>Miễn phí Wi-Fi cho khách hàng tại cửa hàng.</li>
                    <li>Chấp nhận thanh toán bằng thẻ, ví điện tử và tiền mặt.</li>
                    <li>Cập nhật các chương trình khuyến mãi định kỳ trên fanpage và website.</li>
                </ul>
            </div>

        </div>
    );
};

export default StorePage;
