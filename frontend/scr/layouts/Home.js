import Blog from "../pages/home/blog";
import Slider from "../pages/home/Slider";
import ProductSale from "../pages/home/ProductSale";
import DailyDeals from "../pages/home/dailydeals";
import Product from './../pages/home/product';
import VietCoffee from "../pages/home/VietCoffee";

function Home(props) {
    return (
        <div>
            <div className="container-fluid px-0">
                <Slider />
            </div>
            <div className="container mt-4">

                <Product />
                <ProductSale />
                <Blog />
                <VietCoffee />
                <DailyDeals />
            </div>

        </div>
    );
}
export default Home;