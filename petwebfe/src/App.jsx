import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Shop from "./pages/Shop";
import PageNotFound from "./pages/PageNotFound";
import Header from "./components/Header";
import Authentication from "./pages/Authentication";
import LoginForm from "./components/LoginForm";
import Calendar from "./components/Calendar";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/auth/:action" element={<Authentication />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
