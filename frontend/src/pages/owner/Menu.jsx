import React, { useState, useEffect, useRef } from "react";
import { createMenu, getMenu, updateMenu, deleteMenu } from "../../services/menuService"
import api from "../../api/axios";
const Menu = ({ action, hasMenu, setHasMenu }) => {

    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [available, setAvailable] = useState(true);
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);

    const fileRef = useRef(null);

    useEffect(() => {
        if (action === "create") {
            setSelectedMenu(null);
            setItemName("");
            setDescription("");
            setPrice("");
            setCategory("");
            setImage(null);
            setAvailable(true);
        }

        if (action === "view") {
            setSelectedMenu(null);
            fetchMenuItems();
        }
    }, [action]);

    const fetchMenuItems = async () => {
        try {
            const response = await getMenu();
            setMenus(response.data.menuItems);
        } catch (error) {
            console.log(error);
        }
    };
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("itemName", itemName);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("available", available);
            if (image) {
                formData.append("image", image);
            }

            const response = await createMenu(formData);
            alert(response.data.message);
            setItemName("");
            setDescription("");
            setCategory("");
            setPrice("");
            setAvailable(true);
            setImage(null);
            fileRef.current.value = "";
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (menu) => {
        setSelectedMenu(menu);
        setItemName(menu.itemName);
        setDescription(menu.description || "");
        setPrice(menu.price);
        setCategory(menu.category);
        setAvailable(menu.available);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("itemName", itemName);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("available", available);
            if (image) {
                formData.append("image", image);
            }
            await updateMenu(selectedMenu._id, formData);
            alert("Menu Item Updated Successfully");
            setSelectedMenu(null);
            setImage(null);
            fetchMenuItems();
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleDelete = async (id) => {

        const confirmDelete = confirm("Are you sure to delete this menu item?");

        if (!confirmDelete) return;
        try {
            await deleteMenu(id);
            alert("Menu Item Deleted Successfully");
            fetchMenuItems();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Delete Failed");
        }
    };
    return (
        <>
            {action === "create" && (
                <div className="contentArea">
                    <form className="authForm" onSubmit={handleCreate}>
                        <h3>Create Menu Item</h3>
                        <label>Item Name</label>
                        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter Menu Name" />

                        <label>Description</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" />

                        <label>Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter Price" />

                        <label>Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter Category" />

                        <label>Image</label>
                        <input ref={fileRef} type="file" onChange={(e) => setImage(e.target.files[0])} />


                        <div>
                            <label>Available</label>
                            <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
                        </div>

                        <button type="submit">Create Menu Item</button>

                    </form>
                </div>
            )}

            {action === "view" && !selectedMenu && (
                <div className="menuView">
                    <div className="menuContainer">
                        <h3>Menu Details</h3>
                        <table className="menuTable">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Image</th>
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Available</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {menus.map((menu) => (
                                    <tr key={menu._id}>
                                        <td>{menu.itemName}</td>
                                        <td>
                                            {menu.image ? (
                                                <img
                                                    src={menu.image}
                                                    alt={menu.itemName}
                                                    width="100"
                                                />
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td>{menu.price}</td>
                                        <td>{menu.description || "N/A"}</td>
                                        {<td>{menu.category}</td>}
                                        <td>
                                            {menu.available ? "Yes" : "No"}
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => handleEdit(menu)}>
                                                Edit
                                            </button>
                                            {" "}
                                            <button type="button" onClick={() => handleDelete(menu._id)} >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            )}

            {selectedMenu && (
                <div className="contentArea">
                    <form className="authForm" onSubmit={handleUpdate} >
                        <h3>Update Menu Item</h3>
                        <label>Item Name</label>
                        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                        <label>Description</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

                        <label>Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                        <label>Image</label>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        <label>Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                        <div>
                            <label>Available    </label>
                            <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
                        </div>

                        <button type="submit"> Update Menu Item</button>
                    </form>
                </div>
            )}



            {
                action === "delete" && (
                    <>
                        <h3>Delete Menu Item</h3>

                        <button>
                            Delete Menu Item
                        </button>
                    </>
                )
            }

        </>
    );
};

export default Menu;