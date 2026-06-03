import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "./CustomerOrderStatus.css";

const STEPS = ["Pending", "Preparing", "Completed"];

const CustomerOrderStatus = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get(`/order/customer-order/${orderId}`);
                setOrder(res.data.order);
            } catch (err) {
                console.log(err);
            }
        };
        fetch();
        const interval = setInterval(fetch, 5000);
        return () => clearInterval(interval);
    }, [orderId]);

    const currentStep = STEPS.indexOf(order?.status);
    const isCompleted = order?.status === "Completed";
    const total = order?.items?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    ) ?? 0;


    return (
        <div className="page">
            <div className="card">

                <div className="cardHeader">
                    <h1>Order Status</h1>
                    <span className={`badge ${order?.status?.toLowerCase()}`}>
                        {order?.status || "Loading…"}
                    </span>
                </div>

                <div className="metaGrid">
                    <div>
                        <p className="label">Order ID</p>
                        <p className="value">#{order?._id?.slice(-6).toUpperCase() || "---"}</p>
                    </div>
                    <div>
                        <p className="label">Customer</p>
                        <p className="value">{order?.customerName || "---"}</p>
                    </div>
                    <div>
                        <p className="label">Table</p>
                        <p className="value">{order?.tableNumber || "---"}</p>
                    </div>
                </div>

                <div className="stepper">
                    {STEPS.map((step, i) => {
                        const done = isCompleted ? true : i < currentStep;
                        const active = !isCompleted && i === currentStep;
                        return (
                            <div key={step} className="step">
                                <div className="stepLeft">
                                    <div className={`dot ${done ? "done" : active ? "active" : ""}`}>
                                        {done ? "✓" : i + 1}
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={`line ${done ? "done" : ""}`} />
                                    )}
                                </div>
                                <p className={`stepName ${active ? "active" : done ? "done" : ""}`}>
                                    {step}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {order?.items?.length > 0 && (
                    <div className="itemList">
                        <p className="sectionTitle">Items Ordered</p>

                        {order.items.map((item, i) => (
                            <div key={i} className="itemRow">
                                <div className="itemInfo">
                                    <span className="itemName">{item.itemName || item.name || "Item"}</span>
                                    <span className="itemUnit">₹{item.price} each</span>
                                </div>
                                <div className="itemRight">
                                    <span className="qty">× {item.quantity}</span>
                                    <span className="itemTotal">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        <div className="priceSummary">
                            <div className="priceRow">
                                <span className="priceLabel">Total</span>
                                <span className="priceValue">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CustomerOrderStatus;