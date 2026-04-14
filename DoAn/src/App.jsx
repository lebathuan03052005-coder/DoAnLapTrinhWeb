import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/login";
import Admin from "./page/admin";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Đường dẫn mặc định sẽ vào trang Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Đường dẫn vào trang Admin */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
