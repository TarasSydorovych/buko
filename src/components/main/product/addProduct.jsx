import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const AddProductForm = () => {
  const [product, setProduct] = useState({
    id: "",
    type: "",
    name: "",
    accessories: [],
  });
  const [accessoryList, setAccessoryList] = useState([]);
  const [newAccessory, setNewAccessory] = useState({
    accessoryId: "",
    name: "",
    quantity: "",
  });
  const [isAccessoryAdded, setIsAccessoryAdded] = useState(false);
  const [isQuantityValid, setIsQuantityValid] = useState(true);

  useEffect(() => {
    fetchAccessories();
  }, []);

  useEffect(() => {
    if (newAccessory.quantity && newAccessory.quantity > 0) {
      setIsQuantityValid(true);
    } else {
      setIsQuantityValid(false);
    }
  }, [newAccessory]);

  const fetchAccessories = async () => {
    const querySnapshot = await getDocs(collection(db, "accessories"));
    setAccessoryList(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
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
    if (isQuantityValid) {
      setProduct({
        ...product,
        accessories: [...product.accessories, { ...newAccessory }],
      });
      setNewAccessory({ accessoryId: "", name: "", quantity: "" });
      setIsAccessoryAdded(true);
    }
  };

  const handleAddProduct = async () => {
    if (product.accessories.length > 0) {
      await addDoc(collection(db, "products"), {
        id: product.id,
        type: product.type,
        name: product.name,
        accessories: product.accessories,
      });
      setProduct({ id: "", type: "", name: "", accessories: [] });
      setIsAccessoryAdded(false);
    } else {
      alert("Додайте хоча б одну комплектуючу до товару.");
    }
  };

  return (
    <div>
      <input
        type="text"
        name="id"
        placeholder="ID"
        value={product.id}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="type"
        placeholder="Вид товару"
        value={product.type}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="name"
        placeholder="Назва"
        value={product.name}
        onChange={handleInputChange}
        required
      />
      <h4>Додати комплектуючі</h4>
      <select
        name="accessoryId"
        value={newAccessory.accessoryId}
        onChange={handleAccessoryChange}
        required={!isAccessoryAdded}
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
        required
      />
      {!isQuantityValid && (
        <p style={{ color: "red" }}>Кількість повинна бути більше 0</p>
      )}
      <button
        type="button"
        onClick={handleAddAccessory}
        disabled={!isQuantityValid}
      >
        Додати комплектуючу
      </button>
      <ul>
        {product.accessories.map((acc, index) => (
          <li key={index}>
            {acc.name} (ID: {acc.accessoryId}): {acc.quantity}
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleAddProduct}>
        Додати товар
      </button>
    </div>
  );
};

export default AddProductForm;
