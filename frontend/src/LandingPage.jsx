import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Restaurant from "./pages/owner/Restaurant";
import Menu from "./pages/owner/Menu"
import Orders from "./pages/owner/Orders"
import { getOrders } from "./services/orderService";
import { getMyRestaurant } from "./services/restaurantService";
import Dashboard from "./pages/owner/Dashboard"
import { getMenu } from "./services/menuService";
import './App.css'

const LandingPage = () => {

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showlogout, setShowLogout] = useState(false);
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [restaurantAction, setRestaurantAction] = useState("");
  const [hasRestaurant, setHasRestaurant] = useState(false);
  const [menuAction, setMenuAction] = useState("");
  const [hasMenu, setHasMenu] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchRestaurant = async () => {
    try {
      const response = await getMyRestaurant();
      setRestaurant(response.data.restaurant);
      setHasRestaurant(true);
    } catch (error) {
      setRestaurant(null);
      setHasRestaurant(false);
    }
  };
  const fetchMenus = async () => {
    try {
      const response = await getMenu();
      setMenus(response.data.menuItems);
      setHasMenu(response.data.menuItems.length > 0);
    } catch (error) {
      setHasMenu(false);
      console.log(error);
    }
  };
  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const logintoken = localStorage.getItem("loginToken");
    if (logintoken) {
      setShowLogout(true);
      fetchRestaurant();
      fetchMenus();
      fetchOrders();
    }
  }, [])
  useEffect(() => {
    if (selectedPage === "dashboard") {
      fetchRestaurant();
      fetchMenus();
      fetchOrders();
    }

  }, [selectedPage]);

  const showRegisterHandler = () => {
    setShowRegister(true);
    setShowLogin(false);
    setSelectedPage("");
    setRestaurantAction("");
    setMenuAction("")
  }
  const showLoginHandler = () => {
    setShowLogin(true);
    setShowRegister(false);
    setSelectedPage("");
    setRestaurantAction("");
    setMenuAction("")



  }
  const logoutHandler = () => {
    confirm("Are you sure to logout?");
    localStorage.removeItem('loginToken');
    localStorage.removeItem('userId');
    setHasRestaurant(false);
    setShowLogout(false);
    setShowLogin(false);
    setShowRegister(false);
    window.location.reload();

  }


  return (
    <>
      <Navbar showLoginHandler={showLoginHandler} showRegisterHandler={showRegisterHandler} restaurant={restaurant} setRestaurant={setRestaurant}
        showlogout={showlogout} logoutHandler={logoutHandler} />
      <div className="collectionSection">
        <Sidebar hasRestaurant={hasRestaurant} setSelectedPage={setSelectedPage} setRestaurantAction={setRestaurantAction}
          hasMenu={hasMenu} setMenuAction={setMenuAction}
          setShowLogin={setShowLogin} setShowRegister={setShowRegister} />

        <div className="contentArea">
          {selectedPage === "dashboard" && (<Dashboard restaurant={restaurant} menus={menus} orders={orders} />
          )}
          {showLogin && <Login />}
          {showRegister && <Register showLoginHandler={showLoginHandler} />}

          {selectedPage === "restaurant" && <Restaurant action={restaurantAction} hasRestaurant={hasRestaurant} setRestaurant={setRestaurant} setHasRestaurant={setHasRestaurant} />}
          {selectedPage === "menu" && <Menu action={menuAction} hasMenu={hasMenu} setHasMenu={setHasMenu} />}
          {selectedPage === "orders" && (<Orders />)}
        </div>

      </div>

    </>
  )
}

export default LandingPage