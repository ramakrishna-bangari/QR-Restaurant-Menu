import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import CustomerMenu from "./pages/customer/CustomerMenu";
import CustomerOrderStatus from "./pages/customer/CustomerOrderStatus";
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu/:restaurantId" element={<CustomerMenu />} />
        <Route path="/order-status/:orderId" element={<CustomerOrderStatus />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;