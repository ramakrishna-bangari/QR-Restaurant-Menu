import React, { useState, useEffect } from "react";

const Sidebar = ({ hasRestaurant, setSelectedPage, setRestaurantAction, setShowLogin, setShowRegister, setMenuAction, }) => {
  const [showRestaurantMenu, setShowRestaurantMenu] = useState(false);
  const [showMenuMenu, setShowMenuMenu] = useState(false);


  return (
    <div className="sidebarSection">
      <ul>
        <li onClick={() => {
          setSelectedPage("dashboard");
          setShowLogin(false);
          setShowRegister(false);
        }}>
          Dashboard
        </li>
        <li onClick={() => setShowRestaurantMenu(!showRestaurantMenu)}>Restaurant </li>

        {showRestaurantMenu && (
          <>
            {!hasRestaurant && (
              <li className="subMenu" onClick={() => {
                const token = localStorage.getItem("loginToken");
                if (!token) {
                  alert("Please login first");
                  return;
                }
                setSelectedPage("restaurant");
                setRestaurantAction("create");
                setShowLogin(false);
                setShowRegister(false);
              }} > Create Restaurant
              </li>
            )}
            <li className="subMenu" onClick={() => {
              const token = localStorage.getItem("loginToken");
              if (!token) {
                alert("Please login first");
                return;
              }
              setSelectedPage("restaurant"); setRestaurantAction("view");
              setShowLogin(false);
              setShowRegister(false);
            }} >
              Restaurant Details
            </li>

            <li className="subMenu" onClick={() => {
              const token = localStorage.getItem("loginToken");
              if (!token) {
                alert("Please login first");
                return;
              }

              setSelectedPage("restaurant"); setRestaurantAction("update");
              setShowLogin(false);
              setShowRegister(false);
            }} >
              Update Restaurant
            </li>

            <li className="subMenu" onClick={() => {
              const token = localStorage.getItem("loginToken");
              if (!token) {
                alert("Please login first");
                return;
              }
              setSelectedPage("restaurant"); setRestaurantAction("delete");
              setShowLogin(false);
              setShowRegister(false);
            }} >
              Delete Restaurant
            </li>
          </>
        )}

        <li onClick={() => setShowMenuMenu(!showMenuMenu)}> Menu</li>

        {showMenuMenu && (
          <>
            <li
              className="subMenu" onClick={() => {
                const token = localStorage.getItem("loginToken");
                if (!token) {
                  alert("Please login first");
                  return;
                }
                setSelectedPage("menu");
                setMenuAction("create");
                setShowLogin(false);
                setShowRegister(false);
              }} >
              Create Menu Item
            </li>

            <li className="subMenu" onClick={() => {
              const token = localStorage.getItem("loginToken");
              if (!token) {
                alert("Please login first");
                return;
              }
              setSelectedPage("menu"); setMenuAction("view");
              setShowLogin(false);
              setShowRegister(false);
            }} >
              View Menu
            </li>

          </>
        )}

        <li onClick={() => {
          setShowLogin(false);
          setShowRegister(false);
          setSelectedPage("orders");
        }} >
          Orders
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;