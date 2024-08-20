// import { useState, useEffect } from "react";
// import { collection, getDocs, query, orderBy } from "firebase/firestore";
// import { db } from "../../../firebase";
// import styles from "../main.module.css";

// const OrdersList = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     const ordersQuery = query(
//       collection(db, "orders"),
//       orderBy("created_at", "desc")
//     );
//     const querySnapshot = await getDocs(ordersQuery);
//     setOrders(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//   };

//   return (
//     <div className={styles.tableContainer}>
//       <h2>Список замовлень</h2>
//       <table className={styles.wrapTableAccser}>
//         <thead>
//           <tr className={styles.tableHeaderRow}>
//             <th className={styles.tableHeaderCell}>ID</th>
//             <th className={styles.tableHeaderCell}>Дата створення</th>
//             <th className={styles.tableHeaderCell}>Статус</th>
//             <th className={styles.tableHeaderCell}>Сума</th>

//             <th className={styles.tableHeaderCell}>Товари</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <tr key={order.id} className={styles.tableRow}>
//               <td className={styles.tableCell}>{order.id}</td>
//               <td className={styles.tableCell}>
//                 {order.created_at
//                   ? new Date(order.created_at).toLocaleDateString()
//                   : "Не вказано"}
//               </td>
//               <td className={styles.tableCell}>
//                 {order.status_id || "Не вказано"}
//               </td>
//               <td className={styles.tableCell}>
//                 {order.grand_total
//                   ? `${order.grand_total.toFixed(2)} грн`
//                   : "Не вказано"}
//               </td>

//               <td className={styles.tableCell}>
//                 {order.products && order.products.length > 0 ? (
//                   <ul>
//                     {order.products.map((product, index) => (
//                       <li key={index}>
//                         {product.name || "Невідомий товар"} (SKU:{" "}
//                         {product.sku || "Невідомий SKU"}), кількість:{" "}
//                         {product.quantity || "0"}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>Товари відсутні</p>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrdersList;
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from "../main.module.css";
import css from "../product/product.module.css";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Кількість замовлень на сторінку

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(ordersQuery);
    setOrders(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Розрахунок індексів замовлень для поточної сторінки
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Функції для перемикання сторінок
  const nextPage = () => {
    if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <h2>Список замовлень</h2>
      <table className={styles.wrapTableAccser}>
        <thead>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeaderCell}>ID</th>
            <th className={styles.tableHeaderCell}>Дата створення</th>
            <th className={styles.tableHeaderCell}>Статус</th>
            <th className={styles.tableHeaderCell}>Сума</th>
            <th className={styles.tableHeaderCell}>Товари</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{order.id}</td>
              <td className={styles.tableCell}>
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : "Не вказано"}
              </td>
              <td className={styles.tableCell}>
                {order.status_id || "Не вказано"}
              </td>
              <td className={styles.tableCell}>
                {order.grand_total
                  ? `${order.grand_total.toFixed(2)} грн`
                  : "Не вказано"}
              </td>
              <td className={styles.tableCell}>
                {order.products && order.products.length > 0 ? (
                  <ul>
                    {order.products.map((product, index) => (
                      <li key={index}>
                        {product.name || "Невідомий товар"} (SKU:{" "}
                        {product.sku || "Невідомий SKU"}), кількість:{" "}
                        {product.quantity || "0"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Товари відсутні</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={css.editButton}
        >
          Попередня
        </button>
        <span>
          Сторінка {currentPage} з {Math.ceil(orders.length / ordersPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
          className={css.editButton}
        >
          Наступна
        </button>
      </div>
    </div>
  );
};

export default OrdersList;
