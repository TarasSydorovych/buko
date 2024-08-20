// import { useState, useEffect } from "react";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { db } from "../../../firebase";
// import AddProductForm from "./addProduct";
// import styles from "./product.module.css";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [accessoryList, setAccessoryList] = useState([]);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [editingProductDocId, setEditingProductDocId] = useState(null);
//   const [editedProduct, setEditedProduct] = useState(null);
//   const [newAccessory, setNewAccessory] = useState({
//     accessoryId: "",
//     name: "",
//     quantity: "",
//   });

//   useEffect(() => {
//     fetchProducts();
//     fetchAccessories();
//   }, []);

//   const fetchProducts = async () => {
//     const querySnapshot = await getDocs(collection(db, "products"));
//     setProducts(
//       querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }))
//     );
//   };

//   const fetchAccessories = async () => {
//     const querySnapshot = await getDocs(collection(db, "accessories"));
//     setAccessoryList(
//       querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//     );
//   };

//   const handleEditClick = (product) => {
//     setEditingProductDocId(product.docId);
//     setEditedProduct({ ...product });
//   };

//   const handleSaveClick = async () => {
//     const productDoc = doc(db, "products", editingProductDocId);
//     await updateDoc(productDoc, editedProduct);
//     setEditingProductDocId(null);
//     setEditedProduct(null);
//     fetchProducts();
//   };

//   const handleDeleteClick = async (docId) => {
//     await deleteDoc(doc(db, "products", docId));
//     fetchProducts();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedProduct({ ...editedProduct, [name]: value });
//   };

//   const handleAccessoryChange = (e) => {
//     const { value } = e.target;
//     const selectedAccessory = accessoryList.find((acc) => acc.id === value);

//     if (selectedAccessory) {
//       setNewAccessory({
//         accessoryId: selectedAccessory.id,
//         name: selectedAccessory.name,
//         quantity: newAccessory.quantity,
//       });
//     }
//   };

//   const handleQuantityChange = (e) => {
//     const { value } = e.target;
//     setNewAccessory({ ...newAccessory, quantity: value });
//   };

//   const handleAddAccessory = () => {
//     if (newAccessory.quantity > 0 && newAccessory.accessoryId) {
//       setEditedProduct({
//         ...editedProduct,
//         accessories: [...editedProduct.accessories, { ...newAccessory }],
//       });
//       setNewAccessory({ accessoryId: "", name: "", quantity: "" });
//     }
//   };

//   const handleDeleteAccessory = (index) => {
//     const updatedAccessories = editedProduct.accessories.filter(
//       (_, i) => i !== index
//     );
//     setEditedProduct({ ...editedProduct, accessories: updatedAccessories });
//   };

//   const handleEditAccessoryQuantity = (index, newQuantity) => {
//     const updatedAccessories = editedProduct.accessories.map((acc, i) =>
//       i === index ? { ...acc, quantity: newQuantity } : acc
//     );
//     setEditedProduct({ ...editedProduct, accessories: updatedAccessories });
//   };

//   return (
//     <div className={styles.tableContainer}>
//       <button
//         onClick={() => setShowAddProduct(!showAddProduct)}
//         className={styles.editButton}
//       >
//         Додати товар
//       </button>
//       {showAddProduct && <AddProductForm />}
//       <h2>Список товарів</h2>
//       <table className={styles.productTable}>
//         <thead>
//           <tr className={styles.tableHeaderRow}>
//             <th className={styles.tableHeaderCell}>ID</th>
//             <th className={styles.tableHeaderCell}>Вид</th>
//             <th className={styles.tableHeaderCell}>Назва</th>
//             <th className={styles.tableHeaderCell}>Комплектуючі</th>
//             <th className={styles.tableHeaderCell}>Дії</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product) => (
//             <tr
//               key={product.docId}
//               className={
//                 editingProductDocId === product.docId
//                   ? styles.editingRow
//                   : styles.tableRow
//               }
//             >
//               {editingProductDocId === product.docId ? (
//                 <>
//                   <td className={styles.tableCell}>
//                     <input
//                       type="text"
//                       name="type"
//                       value={editedProduct.type}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                   <td className={styles.tableCell}>
//                     <input
//                       type="text"
//                       name="name"
//                       value={editedProduct.name}
//                       onChange={handleInputChange}
//                     />
//                   </td>
//                   <td className={styles.tableCell}>
//                     <ul>
//                       {editedProduct.accessories.map((acc, index) => (
//                         <li key={index}>
//                           {acc.name}:{" "}
//                           <input
//                             type="number"
//                             value={acc.quantity}
//                             onChange={(e) =>
//                               handleEditAccessoryQuantity(index, e.target.value)
//                             }
//                           />
//                           <button
//                             className={styles.deleteButton}
//                             onClick={() => handleDeleteAccessory(index)}
//                           >
//                             Видалити комплектуючу
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   </td>
//                   <td className={styles.tableCell}>
//                     <select
//                       name="accessoryId"
//                       value={newAccessory.accessoryId}
//                       onChange={handleAccessoryChange}
//                     >
//                       <option value="">Виберіть комплектуючу</option>
//                       {accessoryList.map((acc) => (
//                         <option key={acc.id} value={acc.id}>
//                           {acc.name}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       type="number"
//                       name="quantity"
//                       placeholder="Кількість на одиницю товару"
//                       value={newAccessory.quantity}
//                       onChange={handleQuantityChange}
//                     />
//                     <button
//                       type="button"
//                       className={styles.editButton}
//                       onClick={handleAddAccessory}
//                       disabled={
//                         !newAccessory.accessoryId || !newAccessory.quantity
//                       }
//                     >
//                       Додати комплектуючу
//                     </button>
//                     <button
//                       className={styles.saveButton}
//                       onClick={handleSaveClick}
//                     >
//                       Зберегти
//                     </button>
//                   </td>
//                 </>
//               ) : (
//                 <>
//                   <td className={styles.tableCell}>{product.id}</td>
//                   <td className={styles.tableCell}>{product.type}</td>
//                   <td className={styles.tableCell}>{product.name}</td>
//                   <td className={styles.tableCell}>
//                     <ul>
//                       {product.accessories.map((acc, index) => (
//                         <li key={index}>
//                           {acc.name}: {acc.quantity}
//                         </li>
//                       ))}
//                     </ul>
//                   </td>
//                   <td className={styles.tableCell}>
//                     <div className={styles.buttonContainer}>
//                       <button
//                         className={styles.editButton}
//                         onClick={() => handleEditClick(product)}
//                       >
//                         Редагувати
//                       </button>
//                       <button
//                         className={styles.deleteButton}
//                         onClick={() => handleDeleteClick(product.docId)}
//                       >
//                         Видалити
//                       </button>
//                     </div>
//                   </td>
//                 </>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProductList;
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import AddProductForm from "./addProduct";
import styles from "./product.module.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [accessoryList, setAccessoryList] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductDocId, setEditingProductDocId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [newAccessory, setNewAccessory] = useState({
    accessoryId: "",
    name: "",
    quantity: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchAccessories();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    setProducts(
      querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }))
    );
  };

  const fetchAccessories = async () => {
    const querySnapshot = await getDocs(collection(db, "accessories"));
    setAccessoryList(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const handleEditClick = (product) => {
    setEditingProductDocId(product.docId);
    setEditedProduct({ ...product });
  };

  const handleSaveClick = async () => {
    const productDoc = doc(db, "products", editingProductDocId);
    await updateDoc(productDoc, editedProduct);
    setEditingProductDocId(null);
    setEditedProduct(null);
    fetchProducts();
  };

  const handleDeleteClick = async (docId) => {
    await deleteDoc(doc(db, "products", docId));
    fetchProducts();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleAccessoryChange = (e) => {
    const { value } = e.target;
    const selectedAccessory = accessoryList.find((acc) => acc.id === value);

    if (selectedAccessory) {
      setNewAccessory({
        accessoryId: selectedAccessory.id,
        name: selectedAccessory.name,
        quantity: newAccessory.quantity,
      });
    }
  };

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setNewAccessory({ ...newAccessory, quantity: value });
  };

  const handleAddAccessory = () => {
    if (newAccessory.quantity > 0 && newAccessory.accessoryId) {
      setEditedProduct({
        ...editedProduct,
        accessories: [...editedProduct.accessories, { ...newAccessory }],
      });
      setNewAccessory({ accessoryId: "", name: "", quantity: "" });
    }
  };

  const handleDeleteAccessory = (index) => {
    const updatedAccessories = editedProduct.accessories.filter(
      (_, i) => i !== index
    );
    setEditedProduct({ ...editedProduct, accessories: updatedAccessories });
  };

  const handleEditAccessoryQuantity = (index, newQuantity) => {
    const updatedAccessories = editedProduct.accessories.map((acc, i) =>
      i === index ? { ...acc, quantity: newQuantity } : acc
    );
    setEditedProduct({ ...editedProduct, accessories: updatedAccessories });
  };

  const calculateMaxProduction = (product) => {
    let maxProduction = Infinity;

    product.accessories.forEach((accessory) => {
      const matchingAccessory = accessoryList.find(
        (acc) => acc.id === accessory.accessoryId
      );
      if (matchingAccessory) {
        const availableQuantity = parseFloat(matchingAccessory.quantity);
        const requiredQuantity = parseFloat(accessory.quantity);
        const possibleCount = Math.floor(availableQuantity / requiredQuantity);

        if (possibleCount < maxProduction) {
          maxProduction = possibleCount;
        }
      } else {
        maxProduction = 0;
      }
    });

    return maxProduction === Infinity ? 0 : maxProduction;
  };

  return (
    <div className={styles.tableContainer}>
      <button
        onClick={() => setShowAddProduct(!showAddProduct)}
        className={styles.editButton}
      >
        Додати товар
      </button>
      {showAddProduct && <AddProductForm />}
      <h2>Список товарів</h2>
      <table className={styles.productTable}>
        <thead>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeaderCell}>ID</th>
            <th className={styles.tableHeaderCell}>Вид</th>
            <th className={styles.tableHeaderCell}>Назва</th>
            <th className={styles.tableHeaderCell}>Комплектуючі</th>
            <th className={styles.tableHeaderCell}>Макс. кількість товарів</th>
            <th className={styles.tableHeaderCell}>Дії</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.docId}
              className={
                editingProductDocId === product.docId
                  ? styles.editingRow
                  : styles.tableRow
              }
            >
              {editingProductDocId === product.docId ? (
                <>
                  <td className={styles.tableCell}>
                    <input
                      type="text"
                      name="type"
                      value={editedProduct.type}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className={styles.tableCell}>
                    <input
                      type="text"
                      name="name"
                      value={editedProduct.name}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className={styles.tableCell}>
                    <ul>
                      {editedProduct.accessories.map((acc, index) => (
                        <li key={index}>
                          {acc.name}:{" "}
                          <input
                            type="number"
                            value={acc.quantity}
                            onChange={(e) =>
                              handleEditAccessoryQuantity(index, e.target.value)
                            }
                          />
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteAccessory(index)}
                          >
                            Видалити комплектуючу
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className={styles.tableCell}>
                    <select
                      name="accessoryId"
                      value={newAccessory.accessoryId}
                      onChange={handleAccessoryChange}
                    >
                      <option value="">Виберіть комплектуючу</option>
                      {accessoryList.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Кількість на одиницю товару"
                      value={newAccessory.quantity}
                      onChange={handleQuantityChange}
                    />
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={handleAddAccessory}
                      disabled={
                        !newAccessory.accessoryId || !newAccessory.quantity
                      }
                    >
                      Додати комплектуючу
                    </button>
                    <button
                      className={styles.saveButton}
                      onClick={handleSaveClick}
                    >
                      Зберегти
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className={styles.tableCell}>{product.id}</td>
                  <td className={styles.tableCell}>{product.type}</td>
                  <td className={styles.tableCell}>{product.name}</td>
                  <td className={styles.tableCell}>
                    <ul>
                      {product.accessories.map((acc, index) => (
                        <li key={index}>
                          {acc.name}: {acc.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className={styles.tableCell}>
                    {calculateMaxProduction(product)}
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.buttonContainer}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditClick(product)}
                      >
                        Редагувати
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(product.docId)}
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
