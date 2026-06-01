/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useRef, useState } from "react";
import { fetchFoodList } from "../components/service/foodService";
import { addToCart, getCartData, removeQtyFromCart } from "../components/service/cartService";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [foodList, setFoodList]     = useState([]);
    const [quantities, setQuantities] = useState({});
    const [token, setToken]           = useState("");
    const [loading, setLoading]       = useState(true);

    const setTokenRef = useRef(setToken);
    setTokenRef.current = setToken;

    // Global axios interceptor — auto-logout on expired/invalid token
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (res) => res,
            (error) => {
                const data = error.response?.data;
                if (
                    error.response?.status === 401 &&
                    (data?.error === "TOKEN_EXPIRED" || data?.error === "TOKEN_INVALID")
                ) {
                    localStorage.removeItem("token");
                    setTokenRef.current("");
                    toast.error("Session expired. Please log in again.");
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const loadCartData = async (tkn) => {
        try {
            const items = await getCartData(tkn);
            setQuantities(items || {});
        } catch {
            // cart load failure is non-fatal — user can still browse
        }
    };

    const increaseQty = async (foodId) => {
        if (!token) {
            toast.info("Please login to add items to cart.", { toastId: "login-prompt" });
            return;
        }
        setQuantities(prev => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
        try {
            await addToCart(foodId, token);
        } catch {
            setQuantities(prev => ({ ...prev, [foodId]: Math.max((prev[foodId] || 1) - 1, 0) }));
            toast.error("Failed to add item. Please try again.");
        }
    };

    const decreaseQty = async (foodId) => {
        if (!token) return;
        setQuantities(prev => ({
            ...prev,
            [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0
        }));
        try {
            await removeQtyFromCart(foodId, token);
        } catch {
            setQuantities(prev => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
            toast.error("Failed to update cart. Please try again.");
        }
    };

    const removeFromCart = (foodId) => {
        setQuantities(prev => {
            const updated = { ...prev };
            delete updated[foodId];
            return updated;
        });
    };

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await fetchFoodList();
                setFoodList(data || []);
            } catch {
                toast.error("Failed to load food menu. Please refresh.");
            } finally {
                setLoading(false);
            }

            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            }
        }
        loadData();
    }, []);

    return (
        <StoreContext.Provider value={{
            foodList,
            loading,
            increaseQty,
            decreaseQty,
            quantities,
            setQuantities,
            removeFromCart,
            token,
            setToken,
            loadCartData
        }}>
            {props.children}
        </StoreContext.Provider>
    );
};
