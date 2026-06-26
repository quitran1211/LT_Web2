import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Main from './layouts/Main';
import "./assets/sass/bootstrap.scss";
import "./assets/sass/ui.scss";
import "./assets/sass/responsive.scss";

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;