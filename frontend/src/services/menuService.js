import api from "../api/axios";

export const createMenu = async (formData) => {
    return await api.post(
        "/menu/create-menu",
        formData,
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};

export const getMenu = async () => {
    return await api.get(
        "/menu/get-menu",
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};

export const updateMenu = async (id, formData) => {
    return await api.put(
        `/menu/update-menu/${id}`, formData,
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};
export const deleteMenu = async (id) => {
    return await api.delete(
        `/menu/delete-menu/${id}`,
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};