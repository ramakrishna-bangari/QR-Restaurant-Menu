import api from "../api/axios";

export const createRestaurant = async (formData) => {
    return await api.post(
        "/restaurant/create-restaurant", formData,
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};

// Get Restaurant
export const getMyRestaurant = async () => {
    return await api.get(
        "/restaurant/get-myrestaurant",
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};

// Update Restaurant
export const updateRestaurant = async (
    restaurantId,
    formData
) => {
    return await api.put(
        `/restaurant/update-restaurant/${restaurantId}`,
        formData,
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};

// Delete Restaurant
export const deleteRestaurant = async (
    restaurantId
) => {
    return await api.delete(
        `/restaurant/delete-restaurant/${restaurantId}`,
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};