import React from 'react';

const Footer = () => (
    <footer className="section-footer text-white"
        style={{ backgroundColor: "#6b2b10" }}
    >
        <div className="container">

            {/* Footer top section: contact, info, account, newsletter */}
            <section className="footer-top padding-y-lg border-bottom">
                <div className="row">

                    {/* Contact us */}
                    <aside className="col-md-4 col-12">
                        <article className="mr-md-4">
                            <h5 className="title">Liên hệ với chúng tôi</h5>
                            <ul className="list-icon">
                                <li><i className="icon fa fa-map-marker"></i>20 Tăng Nhơn Phú, Phước Long B, Thủ Đức, Tp.Hồ Chí Minh</li>
                                <li><i className="icon fa fa-envelope"></i> info@example.com</li>
                                <li><i className="icon fa fa-phone"></i> 0865 585 327</li>
                                <li><i className="icon fa fa-clock"></i> T2-T7 10:00pm - 7:00pm</li>
                            </ul>
                        </article>
                    </aside>

                    {/* Information links */}
                    <aside className="col-md col-6">
                        <h5 className="title">Thông tin</h5>
                        <ul className="list-unstyled">
                            <li><a href="/contact">Về chúng tôi</a></li>
                            <li><a href="/contact">Tìm cửa hàng</a></li>
                            <li><a href="/contact">Chính sách</a></li>
                            <li><a href="/contact">Bảo mật</a></li>

                        </ul>
                    </aside>

                    {/* Newsletter and social links */}
                    <aside className="col-md-4 col-12">
                        <h5 className="title">Thư mới</h5>
                        <p> Nhận được thông báo về những món hàng mới, khuyến mãi mới</p>

                        <form className="form-inline mb-3">
                            <input type="text" placeholder="Email" className="border-0 w-auto form-control" name="" />
                            <button className="btn ml-2"
                                style={{
                                    backgroundColor: "white",
                                    borderColor: "white",
                                    color: "#6B2B10",
                                }}
                            >Đăng ký</button>
                        </form>

                        <p className="text-white-50 mb-2">Theo dõi chúng tôi trên các nền tảng</p>
                        <div >
                            <a href="#" className="btn btn-icon btn-outline-light" ><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="btn btn-icon btn-outline-light"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="btn btn-icon btn-outline-light"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="btn btn-icon btn-outline-light"><i className="fab fa-youtube"></i></a>
                        </div>
                    </aside>

                </div> {/* End row */}
            </section> {/* End footer-top */}

            {/* Footer bottom section */}
            <section className="footer-bottom text-center">
                <p className="text-white">Privacy Policy - Terms of Use - User Information Legal Enquiry Guide</p>
                <p className="text-muted">&copy; 2019 Cwis Coffee, All rights reserved</p>
                <br />
            </section> {/* End footer-bottom */}

        </div> {/* End container */}
    </footer>
);

export default Footer;
