import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./CustomerMenu.css";

const CustomerMenu = () => {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cartOpen, setCartOpen] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get(`/menu/customer-menu/${restaurantId}`);
                setRestaurant(response.data.restaurant);
                setMenuItems(response.data.menuItems);
            } catch (error) {
                console.log(error);
            }
        };
        fetchMenu();
    }, [restaurantId]);

    const categories = ["All", ...new Set(menuItems.map(i => i.category))];
    const availableItems = menuItems.filter(item => item.available);

    const filtered = selectedCategory === "All" ? availableItems : availableItems.filter(
        item => item.category === selectedCategory
    );
    const change = (id, delta) =>
        setQuantities(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + delta) }));

    const cartItems = menuItems.filter(i => quantities[i._id] > 0);
    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * quantities[i._id], 0);
    const cartCount = cartItems.reduce((sum, i) => sum + quantities[i._id], 0);

    const placeOrder = async () => {
        try {
            const items = cartItems.map(item => ({
                menuItemId: item._id,
                quantity: quantities[item._id]
            }));
            const response = await api.post("/order/place-order",
                {
                    restaurantId,
                    customerName,
                    tableNumber,
                    items
                }
            );
            alert(response.data.message);
            setQuantities({});
            setCustomerName("");
            setTableNumber("");
            setCartOpen(false);
            navigate(`/order-status/${response.data.order._id}`);
        } catch (error) {
            console.log(error);
            alert("Order Failed");
        }
    };


    return (
        <div className="customerMenuContainer">
            <header className="restaurantHeader">
                <div className="restaurantDetails">
                    <h1>{restaurant?.restaurantName}</h1>
                    <p>{restaurant?.address}</p>
                </div>

                {restaurant?.logo && (
                    <img
                        className="restaurantLogo"
                        src={restaurant.logo}
                        alt="Restaurant Logo"
                    />
                )}
            </header>

            <div className="categoryContainer">
                {categories.map(c => (
                    <button key={c} className={c === selectedCategory ? "categoryButton activeCategory" : "categoryButton"}
                        onClick={() => setSelectedCategory(c)}>{c}</button>
                ))}
            </div>

            <div className="menuGrid">
                {filtered.map(item => {
                    const qty = quantities[item._id] || 0;
                    return (
                        <div key={item._id} className="menuCard">
                            <img src={item.image} alt={item.itemName} />
                            <div className="menuCardBody">
                                <h3>{item.itemName}</h3>
                                <p>{item.description}</p>
                                <div className="menuCardFooter">
                                    <span className="menuPrice">₹{item.price}</span>
                                    {qty === 0
                                        ? <button className="addButton" onClick={() => change(item._id, 1)}>+ Add</button>
                                        : <div className="quantityControl">
                                            <button onClick={() => change(item._id, -1)}>−</button>
                                            <span>{qty}</span>
                                            <button onClick={() => change(item._id, 1)}>+</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {cartCount > 0 && (
                <button className="cartButton" onClick={() => setCartOpen(true)}>
                    <span className="cartCount">{cartCount}</span>
                    View Cart
                    <span className="cartTotal">₹{cartTotal}</span>
                </button>
            )}

            {cartOpen && (
                <div className="cartOverlay" onClick={() => setCartOpen(false)}>
                    <div className="cartDrawer" onClick={e => e.stopPropagation()}>
                        <div className="cartHeader">
                            <h2>Your Order</h2>
                            <button className="closeCartButton" onClick={() => setCartOpen(false)}>✕</button>
                        </div>
                        <div className="cartItems">
                            {cartItems.map(item => (
                                <div key={item._id} className="cartItem">
                                    <div className="cartItemInfo">
                                        <span className="cartItemName">{item.itemName}</span>
                                        <span className="cartItemPrice">₹{item.price * quantities[item._id]}</span>
                                    </div>
                                    <div className="quantityControl">
                                        <button onClick={() => change(item._id, -1)}>−</button>
                                        <span>{quantities[item._id]}</span>
                                        <button onClick={() => change(item._id, 1)}>+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cartFooter">
                            <div className="cartTotalRow">
                                <input type="text" placeholder="Customer Name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required
                                />
                                <input type="number" placeholder="Table Number"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    required
                                />
                                <span>Total</span>
                                <span className="totalAmount">₹{cartTotal}</span>
                            </div>
                            <button className="placeOrderButton" onClick={placeOrder}>
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerMenu;