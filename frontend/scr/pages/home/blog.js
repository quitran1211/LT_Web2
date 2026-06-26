import React from "react";

const Blog = () => (
    <section className="padding-bottom">
        <div className="row">
            {/* --- Banner 1 --- */}
            <aside className="col-md-6">
                <div className="card card-banner-lg bg-dark">
                    <img
                        src={require("../../assets/images/banners/banner4.jpg")}
                        className="card-img opacity"
                        alt="Big Deal Banner"
                    />
                    <div className="card-img-overlay text-white">
                        <h2 className="card-title">Khi Hương Vị Gặp Phong Cách</h2>
                        <p className="card-text" style={{ maxWidth: "80%" }}>
                            Ngày nay, cà phê không chỉ là thức uống giúp tỉnh táo mà còn là
                            một phần của phong cách sống. Từ ly cappuccino đậm đà buổi sáng
                            đến matcha latte hay cold brew sảng khoái, mỗi loại đều mang nét
                            cá tính riêng. Giữa nhịp sống hiện đại, việc dừng lại vài phút để
                            thưởng thức hương cà phê thơm nồng hay ly trà sữa mát lạnh chính
                            là cách chúng ta tìm lại năng lượng và cảm hứng cho cả ngày.
                        </p>
                    </div>
                </div>
            </aside>

            {/* --- Banner 2 --- */}
            <div className="col-md-6">
                <div className="card card-banner-lg bg-dark">
                    <img
                        src={require("../../assets/images/banners/banner5.jpg")}
                        className="card-img opacity"
                        alt="Bundle Banner"
                    />
                    <div className="card-img-overlay text-white">
                        <h2 className="card-title">Hành Trình Của Một Hạt Cà Phê</h2>
                        <p className="card-text" style={{ maxWidth: "80%" }}>
                            Ít ai biết rằng để có một ly cà phê thơm nồng, hạt cà phê phải trải qua hành trình dài
                            từ những nông trại xanh mướt trên cao nguyên đến bàn tay người thưởng thức. Mỗi công đoạn — thu hoạch,
                            rang xay, pha chế — đều chứa đựng tâm huyết và nghệ thuật riêng. Chính vì thế, khi nhấp một ngụm cà phê,
                            ta không chỉ cảm nhận vị đắng – ngọt mà còn là câu chuyện của đất trời, con người và niềm đam mê trong từng
                            giọt đen sóng sánh.                        </p>
                    </div>
                </div>
            </div>
            {/* col.// */}
        </div>
        {/* row.// */}
    </section>
);

export default Blog;
