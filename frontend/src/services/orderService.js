import api from "../api/axios";

export const getOrders = async () => {
    return await api.get(
        "/order/get-order",
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};

export const updateOrderStatus = async (
    id,
    status
) => {
    return await api.put(
        `/order/update-order/${id}`,
        { status },
        {
            headers: {
                token: localStorage.getItem("loginToken")
            }
        }
    );
};

export const deleteOrder = async (id) => {
    return await api.delete(`/order/delete-order/${id}`, {
        headers: { token: localStorage.getItem("loginToken") }
    });
};