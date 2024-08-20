// import { useState, useEffect } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../../firebase";
// import css from "../main.module.css";
// const CriticalAccessoriesList = () => {
//   const [criticalAccessories, setCriticalAccessories] = useState([]);

//   useEffect(() => {
//     fetchCriticalAccessories();
//   }, []);

//   const fetchCriticalAccessories = async () => {
//     const querySnapshot = await getDocs(collection(db, "accessories"));
//     const accessories = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     const filteredAccessories = accessories.filter(
//       (acc) => acc.criticalQuantity >= acc.quantity
//     );

//     setCriticalAccessories(filteredAccessories);
//   };

//   // return (
//   //   <div>
//   //     <h2>Комплектуючі з критичним залишком</h2>
//   //     {criticalAccessories.length > 0 ? (
//   //       <ul>
//   //         {criticalAccessories.map((acc) => (
//   //           <li key={acc.id}>
//   //             <strong>ID:</strong> {acc.id} <br />
//   //             <strong>Назва:</strong> {acc.name} <br />
//   //             <strong>Кількість:</strong> {acc.quantity} {acc.unit} <br />
//   //             <strong>Критичний залишок:</strong> {acc.criticalQuantity} <br />
//   //           </li>
//   //         ))}
//   //       </ul>
//   //     ) : (
//   //       <p>Комплектуючих з критичним залишком не знайдено.</p>
//   //     )}
//   //   </div>
//   // );
//   return (
//     <div>
//       <h2>Комплектуючі з критичним залишком</h2>
//       {criticalAccessories.length > 0 ? (
//         <table className={css.wrapTableAccser}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Назва</th>
//               <th>Кількість</th>
//               <th>Критичний залишок</th>
//             </tr>
//           </thead>
//           <tbody>
//             {criticalAccessories.map((acc) => (
//               <tr key={acc.id} className={css.wrapTrAccser}>
//                 <td className={css.standartTd}>{acc.id}</td>
//                 <td className={css.standartTd}>{acc.name}</td>
//                 <td className={css.standartTd}>
//                   {acc.quantity} {acc.unit}
//                 </td>
//                 <td className={css.standartTd}>{acc.criticalQuantity}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>Комплектуючих з критичним залишком не знайдено.</p>
//       )}
//     </div>
//   );
// };

// export default CriticalAccessoriesList;
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import css from "../main.module.css";

const CriticalAccessoriesList = () => {
  const [criticalAccessories, setCriticalAccessories] = useState([]);

  useEffect(() => {
    fetchCriticalAccessories();
  }, []);

  const fetchCriticalAccessories = async () => {
    const querySnapshot = await getDocs(collection(db, "accessories"));
    const accessories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredAccessories = accessories.filter(
      (acc) => acc.criticalQuantity >= acc.quantity
    );

    setCriticalAccessories(filteredAccessories);
  };

  return (
    <div>
      <h2>Комплектуючі з критичним залишком</h2>
      {criticalAccessories.length > 0 ? (
        <table className={css.wrapTableAccser}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Назва</th>
              <th>Кількість</th>
              <th>Критичний залишок</th>
            </tr>
          </thead>
          <tbody>
            {criticalAccessories.map((acc) => (
              <tr key={acc.id} className={css.wrapTrAccser}>
                <td className={css.standartTd}>{acc.id}</td>
                <td className={css.standartTd}>{acc.name}</td>
                <td className={css.standartTd}>
                  {parseFloat(acc.quantity).toFixed(2)} {acc.unit}
                </td>
                <td className={css.standartTd}>
                  {parseFloat(acc.criticalQuantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Комплектуючих з критичним залишком не знайдено.</p>
      )}
    </div>
  );
};

export default CriticalAccessoriesList;
