import React, { useState } from "react";
import axios from "axios";

const OrderFetcher = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/order/10514");
      console.log("response", response);
      setOrderData(response.data.order);
    } catch (err) {
      setError("Не вдалося отримати замовлення");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchOrder}>Отримати замовлення з ID 10514</button>
      {loading && <p>Завантаження...</p>}
      {error && <p>{error}</p>}
      {orderData && (
        <div>
          <h3>Дані замовлення:</h3>
          <pre>{JSON.stringify(orderData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default OrderFetcher;
