import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get("http://localhost:4000/orders/10392");
        setOrder(response.data);
      } catch (err) {
        setError("Помилка при завантаженні замовлення");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  if (loading) return <p>Завантаження замовлення...</p>;
  if (error) return <p>{error}</p>;
  console.log("order", order);
  return (
    <div>
      <h2>Деталі замовлення</h2>
      {order && (
        <div>
          <p>
            <strong>ID:</strong> {order.id}
          </p>
          <p>
            <strong>Сума:</strong> {order.grand_total}
          </p>
          <p>
            <strong>Статус:</strong> {order.status_id}
          </p>
          <h3>Товари:</h3>
          <ul>
            {order.items &&
              order.items.map((item, index) => (
                <li key={index}>
                  <p>
                    <strong>Назва:</strong> {item.name}
                  </p>
                  <p>
                    <strong>Кількість:</strong> {item.quantity}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
