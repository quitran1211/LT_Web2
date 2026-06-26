import React from 'react';

const Slider = () => (
    <section class="section-intro">
        <div class="container">
            <div
                id="carousel1_indicator"
                className="slider-home-banner carousel slide"
                data-ride="carousel"
            >
                {/* Carousel indicators */}
                <ol className="carousel-indicators">
                    <li data-target="#carousel1_indicator" data-slide-to="0" className="active"></li>
                    <li data-target="#carousel1_indicator" data-slide-to="1"></li>
                </ol>

                {/* Carousel inner with slides */}
                <div className="carousel-inner">
                    <div className="carousel-item active" >
                        <img src={require("../../assets/images/banners/slide-lg-1.jpg")} alt="First slide"
                            style={{ height: "500px" }}
                        />
                    </div>
                    <div className="carousel-item">
                        <img src={require("../../assets/images/banners/slide-lg-2.jpg")} alt="Second slide"
                            style={{ height: "500px" }}

                        />
                    </div>
                </div>

                {/* Carousel controls */}
                <a
                    className="carousel-control-prev"
                    href="#carousel1_indicator"
                    role="button"
                    data-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a
                    className="carousel-control-next"
                    href="#carousel1_indicator"
                    role="button"
                    data-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        </div>
    </section>
);

export default Slider;
