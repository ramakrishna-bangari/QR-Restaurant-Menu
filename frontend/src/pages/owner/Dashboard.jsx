
import React from "react";
import "../../App.css";

const Dashboard = ({ restaurant, menus, orders }) => {

  //  const activeOrders = orders.filter((order) => order.status !== "completed");

    return (
        <div className="dashboardContainer">

            <h2>Restaurant Dashboard</h2>

            <div className="dashboardCards">

                <div className="dashboardCard">
                    <h3>Restaurant</h3>
                    <p>{restaurant?.restaurantName || "N/A"}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Menu Items</h3>
                    <p>{menus?.length || 0}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Orders</h3>
                    <p>{orders?.length || 0}</p>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;