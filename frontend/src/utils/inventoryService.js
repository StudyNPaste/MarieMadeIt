// Inventory Management Service

const API_URL = 'https://backend.mariemadeit.com';

/**
 * Check if items are in stock before checkout
 * @param {Array} items - Array of {id, quantity} objects
 * @returns {Promise} - Results with availability info
 */
export const checkInventory = async (items) => {
  try {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${API_URL}/check-inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Error checking inventory:', error.message);
    return { success: true, results: items.map(i => ({ id: i.id, available: true })) };
  }
};

/**
 * Update inventory after successful payment
 * @param {Array} items - Array of {id, quantity} objects
 * @param {String} orderId - Order ID from payment
 * @returns {Promise} - Update confirmation
 */
export const updateInventory = async (items, orderId) => {
  try {
    const response = await fetch(`${API_URL}/update-inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, orderId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating inventory:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get inventory status for a specific product
 * @param {Number} productId - Product ID
 * @returns {Promise} - Product inventory info
 */
export const getProductInventory = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/product-inventory/${productId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product inventory:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Convert cart data for inventory checking
 * @param {Object} cart - Cart object {productId: quantity, ...}
 * @param {Array} products - All products array
 * @returns {Array} - Array of {id, quantity} with proper product IDs
 */
export const formatCartForInventory = (cart, products) => {
  const items = [];
  products.forEach((product) => {
    if (cart[product.id] && cart[product.id] > 0) {
      items.push({
        id: product.id,
        quantity: cart[product.id],
      });
    }
  });
  return items;
};
