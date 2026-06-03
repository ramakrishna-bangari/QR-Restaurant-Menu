import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "../../services/orderService";
import api from "../../api/axios";

const Orders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data.orders);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdate = async (id, status) => {
        try {
            await updateOrderStatus(id, status);
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.message || "Update Failed");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteOrder(id);  
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.message || "Delete Failed");
        }
    };
    const activeOrders = orders.filter(o => o.status !== "Completed");
    const completedOrders = orders.filter(o => o.status === "Completed");

    const renderTable = (list, showDelete = false) => (
        <table className="menuTable">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Table</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {list.length === 0 ? (
                    <tr>
                        <td colSpan={7} style={{ textAlign: "center", color: "#aaa", padding: "16px" }}>
                            No orders
                        </td>
                    </tr>
                ) : (
                    list.map((order) => (
                        <tr key={order._id}>
                            <td>#{order._id.slice(-6).toUpperCase()}</td>
                            <td>{order.customerName}</td>
                            <td>{order.tableNumber}</td>
                            <td>
                                {order.items.map((item) => (
                                    <div key={item.menuItemId}>
                                        {item.name} x {item.quantity}
                                    </div>
                                ))}
                            </td>
                            <td>₹{order.totalAmount}</td>
                            <td>{order.status}</td>
                            <td style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                {!showDelete && (
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleUpdate(order._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                )}
                                {showDelete && (
                                    <button
                                        onClick={() => handleDelete(order._id)}

                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    return (
        <div className="menuView">
            <div className="menuContainer">

                <h3>Active Orders</h3>
                {renderTable(activeOrders, false)}

                <h3 style={{ marginTop: "32px" }}>Completed Orders</h3>
                {renderTable(completedOrders, true)}

            </div>
        </div>
    );
};

export default Orders;