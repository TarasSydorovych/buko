import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const MasAddProdToFirebase = () => {
  const productsData = [
    {
      id: "10034",
      type: "Браслет шкіряний",
      name: "Браслет шкіряний червоний з магнітною застібкою чорною, 8 мм",
      accessories: [
        {
          accessoryId: "1009",
          name: "Ремінець шкіряний червоний 8*4 мм",
          quantity: 0.2,
        },
        {
          accessoryId: "3011",
          name: "Застібка магнітна чорна матова 8*4 мм",
          quantity: 1.1,
        },
        {
          accessoryId: "7001",
          name: "Елементи для зʼєднання - клей",
          quantity: 0.3,
        },
      ],
    },
    {
      id: "10035",
      type: "Браслет шкіряний",
      name: "Браслет шкіряний червоний з магнітною застібкою срібною, 8 мм",
      accessories: [
        {
          accessoryId: "1009",
          name: "Ремінець шкіряний червоний 8*4 мм",
          quantity: 0.2,
        },
        {
          accessoryId: "3007",
          name: "Застібка магнітна срібна глянцева 8*4 мм",
          quantity: 1.1,
        },
        {
          accessoryId: "7001",
          name: "Елементи для зʼєднання - клей",
          quantity: 0.3,
        },
      ],
    },
    {
      id: "10036",
      type: "Браслет шкіряний",
      name: "Браслет шкіряний червоний з магнітною застібкою золотою, 8 мм",
      accessories: [
        {
          accessoryId: "1009",
          name: "Ремінець шкіряний червоний 8*4 мм",
          quantity: 0.2,
        },
        {
          accessoryId: "3009",
          name: "Застібка магнітна золота глянцева 8*4 мм",
          quantity: 1.1,
        },
        {
          accessoryId: "7001",
          name: "Елементи для зʼєднання - клей",
          quantity: 0.3,
        },
      ],
    },
    {
      id: "10037",
      type: "Браслет шкіряний",
      name: "Браслет шкіряний червоний з магнітною застібкою бронзовою, 8 мм",
      accessories: [
        {
          accessoryId: "1009",
          name: "Ремінець шкіряний червоний 8*4 мм",
          quantity: 0.2,
        },
        {
          accessoryId: "3004",
          name: "Застібка магнітна бронзова матова 8*4 мм",
          quantity: 1.1,
        },
        {
          accessoryId: "7001",
          name: "Елементи для зʼєднання - клей",
          quantity: 0.3,
        },
      ],
    },
  ];

  const handleAddAllProducts = async () => {
    for (const product of productsData) {
      await addDoc(collection(db, "products"), product);
    }
    alert("All products added successfully!");
  };

  return (
    <div>
      <h2>Додати товари з комплектуючими</h2>
      <button onClick={handleAddAllProducts}>Додати всі товари</button>
    </div>
  );
};

export default MasAddProdToFirebase;
