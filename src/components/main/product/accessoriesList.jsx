// import { useState, useEffect } from "react";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   query,
//   where,
// } from "firebase/firestore";
// import css from "../main.module.css";
// import { db } from "../../../firebase";

// const AccessoriesList = () => {
//   const [accessories, setAccessories] = useState([]);
//   const [newAccessory, setNewAccessory] = useState({
//     id: "",
//     name: "",
//     quantity: "",
//     unit: "",
//     criticalQuantity: "", // Додаємо поле для критичного залишку
//   });
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [editAccessoryId, setEditAccessoryId] = useState(null);
//   const [deductionAccessoryId, setDeductionAccessoryId] = useState(null);
//   const [deductionAmount, setDeductionAmount] = useState("");

//   useEffect(() => {
//     fetchAccessories();
//   }, []);

//   const fetchAccessories = async () => {
//     const querySnapshot = await getDocs(collection(db, "accessories"));
//     setAccessories(
//       querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//     );
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAccessory({ ...newAccessory, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       newAccessory.id &&
//       newAccessory.name &&
//       newAccessory.quantity &&
//       newAccessory.unit &&
//       newAccessory.criticalQuantity // Перевірка наявності критичного залишку
//     ) {
//       if (editAccessoryId) {
//         // Оновлення існуючого документа
//         const q = query(
//           collection(db, "accessories"),
//           where("id", "==", editAccessoryId)
//         );
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//           const docRef = querySnapshot.docs[0].ref;
//           await updateDoc(docRef, {
//             id: newAccessory.id,
//             name: newAccessory.name,
//             quantity: parseFloat(newAccessory.quantity),
//             unit: newAccessory.unit,
//             criticalQuantity: parseFloat(newAccessory.criticalQuantity), // Оновлення критичного залишку
//           });
//         }
//       } else {
//         // Додавання нового документа
//         await addDoc(collection(db, "accessories"), {
//           id: newAccessory.id,
//           name: newAccessory.name,
//           quantity: parseFloat(newAccessory.quantity),
//           unit: newAccessory.unit,
//           criticalQuantity: parseFloat(newAccessory.criticalQuantity), // Додавання критичного залишку
//         });
//       }
//       setNewAccessory({
//         id: "",
//         name: "",
//         quantity: "",
//         unit: "",
//         criticalQuantity: "",
//       });
//       setIsFormVisible(false);
//       setEditAccessoryId(null); // Скидаємо стан редагування
//       fetchAccessories();
//     }
//   };

//   const handleEdit = (accessory) => {
//     setEditAccessoryId(accessory.id);
//     setNewAccessory({
//       id: accessory.id,
//       name: accessory.name,
//       quantity: accessory.quantity,
//       unit: accessory.unit,
//       criticalQuantity: accessory.criticalQuantity, // Завантаження критичного залишку для редагування
//     });
//     setIsFormVisible(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDeduct = async (accessoryId) => {
//     const q = query(
//       collection(db, "accessories"),
//       where("id", "==", accessoryId)
//     );
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       alert("Комплектуюча з таким ID не знайдена.");
//       return;
//     }

//     const docRef = querySnapshot.docs[0].ref;
//     const accessory = querySnapshot.docs[0].data();

//     const newQuantity = accessory.quantity - parseFloat(deductionAmount);

//     if (isNaN(newQuantity) || newQuantity < 0) {
//       alert("Неможливо списати більше, ніж доступно, або некоректне значення.");
//       return;
//     }

//     await updateDoc(docRef, { quantity: newQuantity });
//     setDeductionAmount("");
//     setDeductionAccessoryId(null);
//     fetchAccessories();
//   };

//   return (
//     <div>
//       <h2>Комплектуючі</h2>
//       <button onClick={() => setIsFormVisible(!isFormVisible)}>
//         {isFormVisible ? "Приховати форму" : "Додати комплектуючу"}
//       </button>

//       {isFormVisible && (
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="id"
//             placeholder="ID"
//             value={newAccessory.id}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="text"
//             name="name"
//             placeholder="Назва"
//             value={newAccessory.name}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="number"
//             name="quantity"
//             placeholder="Кількість"
//             value={newAccessory.quantity}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="text"
//             name="unit"
//             placeholder="Одиниці вимірювання"
//             value={newAccessory.unit}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="number"
//             name="criticalQuantity"
//             placeholder="Критичний залишок"
//             value={newAccessory.criticalQuantity}
//             onChange={handleInputChange}
//             required
//           />
//           <button type="submit">
//             {editAccessoryId ? "Оновити" : "Додати"}
//           </button>
//         </form>
//       )}

//       {/* <ul className={css.wrapUlAcsser}>
//         {accessories.map((acc) => (
//           <li key={acc.id} className={css.wrapLiAccser}>
//             <strong className={css.standartStrong}>ID: {acc.id}</strong> <br />
//             <strong className={css.standartStrong}>
//               Назва: {acc.name}
//             </strong>{" "}
//             <br />
//             <strong className={css.standartStrong}>
//               Кількість: {acc.quantity} {acc.unit}
//             </strong>{" "}
//             <br />
//             <strong className={css.standartStrong}>
//               Критичний залишок: {acc.criticalQuantity}
//             </strong>{" "}
//             <br />
//             <button onClick={() => handleEdit(acc)}>Редагувати</button>
//             <button onClick={() => setDeductionAccessoryId(acc.id)}>
//               Списати
//             </button>
//             {deductionAccessoryId === acc.id && (
//               <div>
//                 <input
//                   type="number"
//                   placeholder="Сума для списання"
//                   value={deductionAmount}
//                   onChange={(e) => setDeductionAmount(e.target.value)}
//                 />
//                 <button onClick={() => handleDeduct(acc.id)}>
//                   Провести списання
//                 </button>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul> */}
//       <table className={css.wrapTableAccser}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Назва</th>
//             <th>Кількість</th>
//             <th>Критичний залишок</th>
//             <th>Дії</th>
//           </tr>
//         </thead>
//         <tbody>
//           {accessories.map((acc) => (
//             <tr key={acc.id} className={css.wrapTrAccser}>
//               <td className={css.standartTd}>{acc.id}</td>
//               <td className={css.standartTd}>{acc.name}</td>
//               <td className={css.standartTd}>
//                 {acc.quantity} {acc.unit}
//               </td>
//               <td className={css.standartTd}>{acc.criticalQuantity}</td>
//               <td className={css.standartTd}>
//                 <button onClick={() => handleEdit(acc)}>Редагувати</button>
//                 <button onClick={() => setDeductionAccessoryId(acc.id)}>
//                   Списати
//                 </button>
//                 {deductionAccessoryId === acc.id && (
//                   <div>
//                     <input
//                       type="number"
//                       placeholder="Сума для списання"
//                       value={deductionAmount}
//                       onChange={(e) => setDeductionAmount(e.target.value)}
//                     />
//                     <button onClick={() => handleDeduct(acc.id)}>
//                       Провести списання
//                     </button>
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AccessoriesList;
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import css from "../main.module.css";
import { db } from "../../../firebase";
import str from "../product/product.module.css";

const AccessoriesList = () => {
  const [accessories, setAccessories] = useState([]);
  const [newAccessory, setNewAccessory] = useState({
    id: "",
    name: "",
    quantity: "",
    unit: "",
    criticalQuantity: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editAccessoryId, setEditAccessoryId] = useState(null);
  const [deductionAccessoryId, setDeductionAccessoryId] = useState(null);
  const [deductionAmount, setDeductionAmount] = useState("");

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    const querySnapshot = await getDocs(collection(db, "accessories"));
    setAccessories(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        quantity: parseFloat(doc.data().quantity).toFixed(2), // Округляємо кількість
        criticalQuantity: parseFloat(doc.data().criticalQuantity).toFixed(2), // Округляємо критичний залишок
      }))
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccessory({ ...newAccessory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      newAccessory.id &&
      newAccessory.name &&
      newAccessory.quantity &&
      newAccessory.unit &&
      newAccessory.criticalQuantity
    ) {
      if (editAccessoryId) {
        // Оновлення існуючого документа
        const q = query(
          collection(db, "accessories"),
          where("id", "==", editAccessoryId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            id: newAccessory.id,
            name: newAccessory.name,
            quantity: parseFloat(newAccessory.quantity).toFixed(2), // Округляємо кількість
            unit: newAccessory.unit,
            criticalQuantity: parseFloat(newAccessory.criticalQuantity).toFixed(
              2
            ), // Округляємо критичний залишок
          });
        }
      } else {
        // Додавання нового документа
        await addDoc(collection(db, "accessories"), {
          id: newAccessory.id,
          name: newAccessory.name,
          quantity: parseFloat(newAccessory.quantity).toFixed(2), // Округляємо кількість
          unit: newAccessory.unit,
          criticalQuantity: parseFloat(newAccessory.criticalQuantity).toFixed(
            2
          ), // Округляємо критичний залишок
        });
      }
      setNewAccessory({
        id: "",
        name: "",
        quantity: "",
        unit: "",
        criticalQuantity: "",
      });
      setIsFormVisible(false);
      setEditAccessoryId(null);
      fetchAccessories();
    }
  };

  const handleEdit = (accessory) => {
    setEditAccessoryId(accessory.id);
    setNewAccessory({
      id: accessory.id,
      name: accessory.name,
      quantity: accessory.quantity,
      unit: accessory.unit,
      criticalQuantity: accessory.criticalQuantity,
    });
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeduct = async (accessoryId) => {
    const q = query(
      collection(db, "accessories"),
      where("id", "==", accessoryId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Комплектуюча з таким ID не знайдена.");
      return;
    }

    const docRef = querySnapshot.docs[0].ref;
    const accessory = querySnapshot.docs[0].data();

    const newQuantity =
      parseFloat(accessory.quantity) - parseFloat(deductionAmount);

    if (isNaN(newQuantity) || newQuantity < 0) {
      alert("Неможливо списати більше, ніж доступно, або некоректне значення.");
      return;
    }

    await updateDoc(docRef, { quantity: newQuantity.toFixed(2) }); // Округляємо кількість після списання
    setDeductionAmount("");
    setDeductionAccessoryId(null);
    fetchAccessories();
  };

  return (
    <div>
      <h2>Комплектуючі</h2>
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className={str.editButton}
      >
        {isFormVisible ? "Приховати форму" : "Додати комплектуючу"}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={newAccessory.id}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Назва"
            value={newAccessory.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Кількість"
            value={newAccessory.quantity}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="unit"
            placeholder="Одиниці вимірювання"
            value={newAccessory.unit}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="criticalQuantity"
            placeholder="Критичний залишок"
            value={newAccessory.criticalQuantity}
            onChange={handleInputChange}
            required
          />
          <button type="submit">
            {editAccessoryId ? "Оновити" : "Додати"}
          </button>
        </form>
      )}

      <table className={css.wrapTableAccser}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Назва</th>
            <th>Кількість</th>
            <th>Критичний залишок</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {accessories.map((acc) => (
            <tr key={acc.id} className={css.wrapTrAccser}>
              <td className={css.standartTd}>{acc.id}</td>
              <td className={css.standartTd}>{acc.name}</td>
              <td className={css.standartTd}>
                {parseFloat(acc.quantity).toFixed(2)} {acc.unit}
              </td>
              <td className={css.standartTd}>
                {parseFloat(acc.criticalQuantity).toFixed(2)}
              </td>
              <td className={css.standartTd}>
                <button onClick={() => handleEdit(acc)}>Редагувати</button>
                <button onClick={() => setDeductionAccessoryId(acc.id)}>
                  Списати
                </button>
                {deductionAccessoryId === acc.id && (
                  <div>
                    <input
                      type="number"
                      placeholder="Сума для списання"
                      value={deductionAmount}
                      onChange={(e) => setDeductionAmount(e.target.value)}
                    />
                    <button onClick={() => handleDeduct(acc.id)}>
                      Провести списання
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessoriesList;
