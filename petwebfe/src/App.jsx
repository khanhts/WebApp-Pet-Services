import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Shop from "./pages/Shop";
import PageNotFound from "./pages/PageNotFound";
import Header from "./components/Header";
import Checkout from "./pages/Checkout";
import Calendar from "./components/Calendar";
import CartPage from "./pages/CartPage";
import MenuBar from "./components/MenuBar";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <MenuBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/auth/:action" element={<Checkout />} />
        <Route path="/auth" element={<Checkout />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
