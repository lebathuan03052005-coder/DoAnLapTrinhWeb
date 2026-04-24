import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/login";
import Admin from "./page/admin";
import HomePage from "./page/home_page";
import Navbar from "./components/Navbar";
import LoginAdmin from "./page/login_admin";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Route chính dẫn vào trang chủ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login_admin" element={<LoginAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
