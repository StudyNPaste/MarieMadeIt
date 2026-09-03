import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <= 300; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : getDefaultCart();
    });
    const [loading, setLoading] = useState(true);

    // Fetch products and optionally the cart from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productResponse = await fetch("https://backend.mariemadeit.com/allproducts");
                if (!productResponse.ok) throw new Error("Failed to fetch products");
                const products = await productResponse.json();
                setAll_Product(products);

                // Fetch cart if authenticated
                if (localStorage.getItem("auth-token")) {
                    const cartResponse = await fetch("https://backend.mariemadeit.com/getcart", {
                        method: "POST",
                        headers: {
                            Accept: "application/form-data",
                            "auth-token": `${localStorage.getItem("auth-token")}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!cartResponse.ok) throw new Error("Failed to fetch cart");
                    const cartData = await cartResponse.json();

                    // Merge backend cart with local cart
                    setCartItems((prev) => ({
                        ...prev,
                        ...cartData,
                    }));
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Cart manipulation methods
    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] + 1,
        }));

        if (localStorage.getItem("auth-token")) {
            fetch("https://backend.mariemadeit.com/addtocart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const newCount = Math.max(prev[itemId] - 1, 0);
            return { ...prev, [itemId]: newCount };
        });

        if (localStorage.getItem("auth-token")) {
            fetch("https://backend.mariemadeit.com/removefromcart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const contextValue = {
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
