import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ItemType from '../types/items';
import { useCurrentUserContext} from '../contexts/CurrentUserContext';
import './stylesheets/Orders.css';

// Define the API and WebSocket URLs using environment variables
const apiUrl = process.env.REACT_APP_API_URL || '';
const wsUrl = process.env.REACT_APP_WS_URL || ''; // Fallback needed if testing locally

function Orders({ items }) {
  const [orders, setOrders] = useState([]);

  const { currentUser } = useCurrentUserContext();

  // Helper function to load orders (if needed elsewhere, otherwise keep inside deleteOrder)
  // const loadOrders = async () => {
  //   try {
  //     const result = await axios.get(`${apiUrl}/api/orders`);
  //     setOrders(result.data);
  //   } catch (error) {
  //     console.error("Error loading orders:", error);
  //     // Handle error appropriately, maybe show a message
  //   }
  // }

  useEffect(() => {
    if (currentUser.access === 'associate') {
      // Make sure wsUrl is defined before trying to connect
      if (!wsUrl) {
        console.error("WebSocket URL (REACT_APP_WS_URL) is not defined.");
        return () => {}; // Return empty cleanup function
      }

      // Use the absolute WebSocket URL
      const ws = new WebSocket(`${wsUrl}/ws-cafe`); // <-- CHANGE HERE

      ws.onopen = () => {
        console.log('connected');
        // Optionally load initial orders via HTTP if WS only sends updates
        // loadOrders();
      };
      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
      };
      ws.onmessage = (message) => {
        try {
          const newOrders = JSON.parse(message.data);
          setOrders(newOrders); // Assuming WS sends the full list
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };
      ws.onclose = () => {
        console.log('disconnected');
      };

      return () => {
        ws.close();
        setOrders([]);
      };
    }
    return () => {}; // Return empty cleanup function if not associate
  }, [currentUser]); // Removed wsUrl from dependency array as it shouldn't change dynamically

  const deleteOrder = async (order) => {
    try {
      // Use the absolute API URL
      await axios.delete(`${apiUrl}/api/orders/${order.id}`); // <-- CHANGE HERE
      // Reload orders after delete - assuming WS doesn't automatically update on delete
      // If WS sends updates on delete, you might not need this explicit load
      // loadOrders(); // Or rely on the WebSocket to update the list
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  return (
    <div className="orders-component">
      <h2>Existing Orders</h2>
      {orders.length === 0
 ? (
  <div>
    {currentUser.access === 'associate' // Corrected typo 'assocaite' to 'associate'
    ? 'No Orders'
  : 'Access Denied'}
  </div>
 )
 : orders.map((order) => (
 <div className="order" key={order.id}>
 <table>
 <thead>
 <tr>
 <th>Customer</th>
 <th>ZIP Code</th>
 {order.phone && <th>Phone</th>}
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>{order.name}</td>
 <td>{order.zipCode}</td>
 {order.phone && <td>{order.phone}</td>}
 </tr>
 </tbody>
 <thead>
 <tr>
 <th>Quantity</th>
 <th>Item</th>
 </tr>
 </thead>
 <tbody>
 {order.items.map((item) => (
 <tr key={item.itemId}>
 <td>{item.quantity}</td>
 <td>{items.find((i) => i.itemId === item.itemId)?.title}</td>
 </tr>
 ))}
 </tbody>
 </table>
 <button type="button" onClick={() => deleteOrder(order)}>Delete Order</button>
 </div>
 ))}

    </div>
  );
}

Orders.propTypes = {
  items: PropTypes.arrayOf(ItemType).isRequired,
};

export default Orders;