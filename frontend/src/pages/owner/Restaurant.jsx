import React, { useState, useEffect } from "react";
import { createRestaurant, getMyRestaurant, updateRestaurant, deleteRestaurant } from "../../services/restaurantService";
import api from "../../api/axios";
import "../../App.css";
const Restaurant = ({ action, hasRestaurant, setHasRestaurant, setRestaurant }) => {

    const [restaurantName, setRestaurantName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [logo, setLogo] = useState(null);
    const [restaurantId, setRestaurantId] = useState("");
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        if (action === "view" || action === "update" ||
            action === "delete") {
            fetchRestaurant();
        }
    }, [action]);
    const fetchRestaurant = async () => {
        try {
            const response = await getMyRestaurant();
            const restaurant = response.data.restaurant;

            setRestaurantId(restaurant._id);
            setRestaurantName(restaurant.restaurantName);
            setAddress(restaurant.address);
            setPhone(restaurant.phone);
            setQrCode(restaurant.qrCode);
            setLogo(restaurant.logo);
        } catch (error) {
            console.log("Unable to fetch", error);
        }
    };

    const handleImageChange = (e) => {
        setLogo(e.target.files[0]);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append("restaurantName", restaurantName);
            formData.append("address", address);
            formData.append("phone", phone);
            formData.append("logo", logo);

            const response = await createRestaurant(formData);
            alert("Restaurant created successful");
            console.log(response.data.message);
            setRestaurant(response.data.restaurant);
            setHasRestaurant(true);
            setRestaurantName("")
            setAddress("")
            setPhone("");
            setLogo(null);

        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleUpdate = async (e) => {
        if (!hasRestaurant) {
            alert("Please create a restaurant first");
            return;
        }
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append("restaurantName", restaurantName);
            formData.append("address", address);
            formData.append("phone", phone);
            if (logo) {
                formData.append("logo", logo);
            }
            const response = await updateRestaurant(restaurantId, formData);
            setRestaurant(response.data.restaurant);
            console.log(response.data.restaurant);
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message);
        }
    };
    const handleDelete = async () => {
        if (!hasRestaurant) {
            alert("Please create a restaurant first");
            return;
        }
        try {
            const response = await deleteRestaurant(restaurantId);
            confirm("This restaurant will be permanently deleted.");
            alert(response.data.message);
            setRestaurant(null);
            setHasRestaurant(false);

            setRestaurantId("");
            setRestaurantName("");
            setAddress("");
            setPhone("");
        } catch (error) {
            alert("Failed to delete restaurant");
            console.log(error);
        }
    };

    if (action === "create") {
        return (
            <div className="contentArea">
                <form className="authForm" onSubmit={handleCreate} >

                    <h3>Create Restaurant</h3>
                    <label>Restaurant Name</label>
                    <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} placeholder="Enter Restaurant Name" />

                    <label>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" />

                    <label>Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone Number" />

                    <label>Logo</label>
                    <input type="file" onChange={handleImageChange} />

                    <button type="submit">   Create Restaurant </button>
                </form>
            </div>
        );
    }

    if (action === "view") {
        return (
            <div className="contentArea">
                <div className="authForm">

                    <h3>Restaurant Details</h3>
                    {logo && (
                        <img className="restaurantLogo"
                            src={logo}
                            alt="Restaurant Logo"
                            width="120"
                        />
                    )}
                    <div className="restaurantInfo">
                        <p> <strong>Name:</strong> {restaurantName}</p>
                        <p> <strong>Address:</strong> {address} </p>
                        <p> <strong>Phone:</strong> {phone} </p>
                    </div>
                    {qrCode && (
                        <div className="restaurantQR">
                            <h4>Restaurant QR Code</h4>
                            <img src={qrCode} alt="Restaurant QR" width="200" />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (action === "update") {
        return (
            <div className="contentArea">
                <form className="authForm" onSubmit={handleUpdate} >

                    <h3>Update Restaurant</h3>
                    <label>Restaurant Name</label>
                    <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} placeholder="Enter Restaurant Name" />

                    <label>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" />

                    <label>Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone Number" />

                    <label>Logo</label>
                    <input type="file" onChange={handleImageChange} />

                    <button type="submit"> Update Restaurant </button>
                </form>
            </div>
        );
    }

    if (action === "delete") {
        return (
            <div className="authForm">
                <h3>Delete Restaurant</h3>
                <button onClick={handleDelete}>  Delete Restaurant </button>
            </div>
        );
    }
    return null;
};

export default Restaurant;