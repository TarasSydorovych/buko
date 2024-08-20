// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const { initializeApp } = require("firebase/app");
// const {
//   getFirestore,
//   collection,
//   getDocs,
//   setDoc,
//   getDoc,
//   updateDoc,
//   doc,
//   query,
//   orderBy,
//   limit,
//   where,
// } = require("firebase/firestore");

// const app = express();
// const port = 4000;

// app.use(cors());

// // Ініціалізація Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyC_YDhfzxc6JGYN79Q4tzKcK4B7OfWHC_o",
//   authDomain: "buko-4f2d7.firebaseapp.com",
//   projectId: "buko-4f2d7",
//   storageBucket: "buko-4f2d7.appspot.com",
//   messagingSenderId: "995186306537",
//   appId: "1:995186306537:web:a325eb4c0ff24945ae6f78",
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);

// const API_URL = "https://openapi.keycrm.app/v1/order";
// const API_KEY = "NjE5YmY0Mjk2N2ZjM2M3NjE0ZmQ0YThmNDQ4NjYxODY4YzRjOTc2ZQ";
// const TELEGRAM_TOKEN = "7212877208:AAFkcpk5H129XM28qkz9qMYiJe4XS_ne7RI"; // Замість YOUR_TELEGRAM_BOT_TOKEN вставте токен вашого бота
// const TELEGRAM_CHAT_ID = "1890910399";
// // Функція для отримання замовлення за ID
// const fetchOrderById = async (orderId) => {
//   try {
//     const response = await axios.get(
//       `${API_URL}/${orderId}?include=products.offer`,
//       {
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Помилка при отриманні замовлення з ID ${orderId}:`, error);
//     return null;
//   }
// };

// // Функція для оновлення кількості комплектуючих у Firebase
// const updateAccessoriesQuantity = async (product, quantityOrdered) => {
//   for (const accessory of product.accessories) {
//     const accessoryRef = doc(db, "accessories", accessory.accessoryId);
//     const accessorySnapshot = await getDoc(accessoryRef);

//     if (accessorySnapshot.exists()) {
//       const currentAccessory = accessorySnapshot.data();
//       const newQuantity =
//         currentAccessory.quantity - accessory.quantity * quantityOrdered;

//       if (newQuantity >= 0) {
//         await updateDoc(accessoryRef, { quantity: newQuantity });
//         console.log(
//           `Оновлено кількість комплектуючого: ${accessory.name}, нова кількість: ${newQuantity}`
//         );
//       } else {
//         console.log(
//           `Недостатня кількість для комплектуючого: ${accessory.name}`
//         );
//       }
//     } else {
//       console.log(
//         `Комплектуюче з ID ${accessory.accessoryId} не знайдено у колекції accessories`
//       );
//     }
//   }
// };
// // Функція для відправки повідомлення в Telegram
// const sendTelegramMessage = async (message) => {
//   try {
//     const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
//     const response = await axios.post(url, {
//       chat_id: TELEGRAM_CHAT_ID,
//       text: message,
//     });
//     // console.log("Повідомлення надіслано через Telegram:", response.data);
//   } catch (error) {
//     console.error("Помилка при відправці повідомлення в Telegram:", error);
//   }
// };
// // Функція для відстеження критичного залишку комплектуючих
// const checkCriticalAccessories = async () => {
//   const accessoriesSnapshot = await getDocs(collection(db, "accessories"));
//   const criticalAccessories = [];

//   accessoriesSnapshot.forEach((doc) => {
//     const accessory = doc.data();
//     if (accessory.quantity <= accessory.criticalQuantity) {
//       criticalAccessories.push({
//         id: doc.id,
//         name: accessory.name,
//         quantity: accessory.quantity,
//         criticalQuantity: accessory.criticalQuantity,
//       });
//     }
//   });

//   if (criticalAccessories.length > 0) {
//     console.log("Комплектуючі з критичним залишком:", criticalAccessories);

//     criticalAccessories.forEach((accessory) => {
//       const message = `⚠️ Критичний залишок!\n\nНазва: ${accessory.name}\nID: ${accessory.id}\nКількість: ${accessory.quantity}\nКритичний залишок: ${accessory.criticalQuantity}`;
//       sendTelegramMessage(message);
//     });
//   } else {
//     console.log("Немає комплектуючих з критичним залишком.");
//   }
// };
// // Функція для збереження замовлення та оновлення комплектуючих
// const saveOrderToFirebase = async (order) => {
//   try {
//     if (order && order.id) {
//       await setDoc(doc(db, "orders", order.id.toString()), order);
//       console.log("Замовлення збережено:", order.id);

//       for (const item of order.products) {
//         if (item.sku) {
//           const productQuery = query(
//             collection(db, "products"),
//             where("id", "==", item.sku)
//           );
//           const productSnapshot = await getDocs(productQuery);

//           if (!productSnapshot.empty) {
//             const product = productSnapshot.docs[0].data();
//             await updateAccessoriesQuantity(product, item.quantity);
//           } else {
//             console.log(
//               `Товар з SKU ${item.sku} не знайдено у колекції products`
//             );
//           }
//         } else {
//           console.log(`SKU не вказано для товару в замовленні ${order.id}`);
//         }
//       }
//       await checkCriticalAccessories();
//     } else {
//       console.error("Замовлення не містить id або є undefined:", order);
//     }
//   } catch (error) {
//     console.error("Помилка при збереженні замовлення:", error);
//   }
// };
// // Функція для перевірки нових замовлень
// const checkForNewOrders = async () => {
//   const lastOrderQuery = query(
//     collection(db, "orders"),
//     orderBy("id", "desc"),
//     limit(1)
//   );
//   const lastOrderSnapshot = await getDocs(lastOrderQuery);
//   let lastOrderId = null;

//   if (!lastOrderSnapshot.empty) {
//     lastOrderId = lastOrderSnapshot.docs[0].data().id;
//   }

//   const response = await axios.get(API_URL, {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json",
//     },
//   });

//   const orders = response.data.data;
//   for (const order of orders) {
//     if (lastOrderId === null || order.id > lastOrderId) {
//       const detailedOrder = await fetchOrderById(order.id);
//       await saveOrderToFirebase(detailedOrder);
//     }
//   }
// };

// // Запуск сервера
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// // Перевірка нових замовлень кожні 15 секунд
// setInterval(() => {
//   console.log("Перевірка нових замовлень...");
//   checkForNewOrders();
// }, 15000);
// майжу фіналимо
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const { initializeApp } = require("firebase/app");
// const {
//   getFirestore,
//   collection,
//   getDocs,
//   setDoc,
//   getDoc,
//   updateDoc,
//   doc,
//   query,
//   orderBy,
//   limit,
//   where,
// } = require("firebase/firestore");

// const app = express();
// const port = 4000;

// app.use(cors());

// // Ініціалізація Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyC_YDhfzxc6JGYN79Q4tzKcK4B7OfWHC_o",
//   authDomain: "buko-4f2d7.firebaseapp.com",
//   projectId: "buko-4f2d7",
//   storageBucket: "buko-4f2d7.appspot.com",
//   messagingSenderId: "995186306537",
//   appId: "1:995186306537:web:a325eb4c0ff24945ae6f78",
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);

// const API_URL = "https://openapi.keycrm.app/v1/order";
// const API_KEY = "NjE5YmY0Mjk2N2ZjM2M3NjE0ZmQ0YThmNDQ4NjYxODY4YzRjOTc2ZQ";
// const TELEGRAM_TOKEN = "7212877208:AAFkcpk5H129XM28qkz9qMYiJe4XS_ne7RI";
// const TELEGRAM_CHAT_ID = "1890910399";

// // Функція для отримання замовлення за ID
// const fetchOrderById = async (orderId) => {
//   try {
//     const response = await axios.get(
//       `${API_URL}/${orderId}?include=products.offer`,
//       {
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Помилка при отриманні замовлення з ID ${orderId}:`, error);
//     return null;
//   }
// };

// // Функція для оновлення кількості комплектуючих у Firebase
// const updateAccessoriesQuantity = async (product, quantityOrdered) => {
//   for (const accessory of product.accessories) {
//     const accessoryRef = doc(db, "accessories", accessory.accessoryId);
//     const accessorySnapshot = await getDoc(accessoryRef);

//     if (accessorySnapshot.exists()) {
//       const currentAccessory = accessorySnapshot.data();
//       const newQuantity =
//         Number(currentAccessory.quantity) -
//         Number(accessory.quantity) * quantityOrdered;

//       if (newQuantity >= 0) {
//         await updateDoc(accessoryRef, { quantity: newQuantity.toFixed(2) });
//         console.log(
//           `Оновлено кількість комплектуючого: ${
//             accessory.name
//           }, нова кількість: ${newQuantity.toFixed(2)}`
//         );
//       } else {
//         console.log(
//           `Недостатня кількість для комплектуючого: ${accessory.name}`
//         );
//       }
//     } else {
//       console.log(
//         `Комплектуюче з ID ${accessory.accessoryId} не знайдено у колекції accessories`
//       );
//     }
//   }
// };

// // Функція для відправки повідомлення в Telegram
// const sendTelegramMessage = async (message) => {
//   try {
//     const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
//     const response = await axios.post(url, {
//       chat_id: TELEGRAM_CHAT_ID,
//       text: message,
//     });
//   } catch (error) {
//     console.error("Помилка при відправці повідомлення в Telegram:", error);
//   }
// };

// // Функція для відстеження критичного залишку комплектуючих
// const checkCriticalAccessories = async () => {
//   const accessoriesSnapshot = await getDocs(collection(db, "accessories"));
//   const criticalAccessories = [];

//   accessoriesSnapshot.forEach((doc) => {
//     const accessory = doc.data();
//     const quantity = parseFloat(accessory.quantity); // Перетворюємо на число
//     const criticalQuantity = parseFloat(accessory.criticalQuantity); // Перетворюємо на число

//     if (quantity <= criticalQuantity) {
//       criticalAccessories.push({
//         id: doc.id,
//         name: accessory.name,
//         quantity: quantity.toFixed(2), // Округляємо до 2 знаків після коми
//         criticalQuantity: criticalQuantity.toFixed(2), // Округляємо до 2 знаків після коми
//       });
//     }
//   });

//   if (criticalAccessories.length > 0) {
//     criticalAccessories.forEach((accessory) => {
//       const message = `⚠️ Критичний залишок!\n\nНазва: ${accessory.name}\nID: ${accessory.id}\nКількість: ${accessory.quantity}\nКритичний залишок: ${accessory.criticalQuantity}`;
//       sendTelegramMessage(message);
//     });
//   } else {
//     console.log("Немає комплектуючих з критичним залишком.");
//   }
// };

// // Функція для збереження замовлення та оновлення комплектуючих
// const saveOrderToFirebase = async (order) => {
//   try {
//     if (order && order.id) {
//       await setDoc(doc(db, "orders", order.id.toString()), order);
//       console.log("Замовлення збережено:", order.id);

//       for (const item of order.products) {
//         if (item.sku) {
//           const productQuery = query(
//             collection(db, "products"),
//             where("id", "==", item.sku)
//           );
//           const productSnapshot = await getDocs(productQuery);

//           if (!productSnapshot.empty) {
//             const product = productSnapshot.docs[0].data();
//             await updateAccessoriesQuantity(product, item.quantity.toFixed(2)); // Rounded to 2 decimal places
//           } else {
//             console.log(
//               `Товар з SKU ${item.sku} не знайдено у колекції products`
//             );
//           }
//         } else {
//           console.log(`SKU не вказано для товару в замовленні ${order.id}`);
//         }
//       }
//       await checkCriticalAccessories();
//     } else {
//       console.error("Замовлення не містить id або є undefined:", order);
//     }
//   } catch (error) {
//     console.error("Помилка при збереженні замовлення:", error);
//   }
// };

// // Функція для перевірки нових замовлень
// const checkForNewOrders = async () => {
//   const lastOrderQuery = query(
//     collection(db, "orders"),
//     orderBy("id", "desc"),
//     limit(1)
//   );
//   const lastOrderSnapshot = await getDocs(lastOrderQuery);
//   let lastOrderId = null;

//   if (!lastOrderSnapshot.empty) {
//     lastOrderId = lastOrderSnapshot.docs[0].data().id;
//   }

//   const response = await axios.get(API_URL, {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json",
//     },
//   });

//   const orders = response.data.data;
//   for (const order of orders) {
//     if (lastOrderId === null || order.id > lastOrderId) {
//       const detailedOrder = await fetchOrderById(order.id);
//       await saveOrderToFirebase(detailedOrder);
//     }
//   }
// };

// // Запуск сервера
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// // Перевірка нових замовлень кожні 15 секунд
// setInterval(() => {
//   console.log("Перевірка нових замовлень...");
//   checkForNewOrders();
// }, 15000);
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  getDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  where,
} = require("firebase/firestore");

const app = express();
const port = 4000;

app.use(cors());

// Ініціалізація Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_YDhfzxc6JGYN79Q4tzKcK4B7OfWHC_o",
  authDomain: "buko-4f2d7.firebaseapp.com",
  projectId: "buko-4f2d7",
  storageBucket: "buko-4f2d7.appspot.com",
  messagingSenderId: "995186306537",
  appId: "1:995186306537:web:a325eb4c0ff24945ae6f78",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const API_URL = "https://openapi.keycrm.app/v1/order";
const API_KEY = "NjE5YmY0Mjk2N2ZjM2M3NjE0ZmQ0YThmNDQ4NjYxODY4YzRjOTc2ZQ";
const TELEGRAM_TOKEN = "7212877208:AAFkcpk5H129XM28qkz9qMYiJe4XS_ne7RI";
const TELEGRAM_CHAT_ID = "1890910399";

// Функція для отримання замовлення за ID
const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${orderId}?include=products.offer`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Помилка при отриманні замовлення з ID ${orderId}:`, error);
    return null;
  }
};

// Функція для перевірки наявності замовлення в базі даних
const isOrderInDatabase = async (orderId) => {
  const orderRef = doc(db, "orders", orderId.toString());
  const orderSnapshot = await getDoc(orderRef);
  return orderSnapshot.exists();
};

// Функція для оновлення кількості комплектуючих у Firebase
const updateAccessoriesQuantity = async (product, quantityOrdered) => {
  for (const accessory of product.accessories) {
    const accessoryRef = doc(db, "accessories", accessory.accessoryId);
    const accessorySnapshot = await getDoc(accessoryRef);

    if (accessorySnapshot.exists()) {
      const currentAccessory = accessorySnapshot.data();
      const newQuantity =
        Number(currentAccessory.quantity) -
        Number(accessory.quantity) * quantityOrdered;

      if (newQuantity >= 0) {
        await updateDoc(accessoryRef, { quantity: newQuantity.toFixed(2) });
        console.log(
          `Оновлено кількість комплектуючого: ${
            accessory.name
          }, нова кількість: ${newQuantity.toFixed(2)}`
        );
      } else {
        console.log(
          `Недостатня кількість для комплектуючого: ${accessory.name}`
        );
      }
    } else {
      console.log(
        `Комплектуюче з ID ${accessory.accessoryId} не знайдено у колекції accessories`
      );
    }
  }
};

// Функція для відправки повідомлення в Telegram
const sendTelegramMessage = async (message) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error("Помилка при відправці повідомлення в Telegram:", error);
  }
};

// Функція для відстеження критичного залишку комплектуючих
const checkCriticalAccessories = async () => {
  const accessoriesSnapshot = await getDocs(collection(db, "accessories"));
  const criticalAccessories = [];

  accessoriesSnapshot.forEach((doc) => {
    const accessory = doc.data();
    const quantity = parseFloat(accessory.quantity); // Перетворюємо на число
    const criticalQuantity = parseFloat(accessory.criticalQuantity); // Перетворюємо на число

    if (quantity <= criticalQuantity) {
      criticalAccessories.push({
        id: doc.id,
        name: accessory.name,
        quantity: quantity.toFixed(2), // Округляємо до 2 знаків після коми
        criticalQuantity: criticalQuantity.toFixed(2), // Округляємо до 2 знаків після коми
      });
    }
  });

  if (criticalAccessories.length > 0) {
    criticalAccessories.forEach((accessory) => {
      const message = `⚠️ Критичний залишок!\n\nНазва: ${accessory.name}\nID: ${accessory.id}\nКількість: ${accessory.quantity}\nКритичний залишок: ${accessory.criticalQuantity}`;
      sendTelegramMessage(message);
    });
  } else {
    console.log("Немає комплектуючих з критичним залишком.");
  }
};

// Функція для збереження замовлення та оновлення комплектуючих
const saveOrderToFirebase = async (order) => {
  try {
    if (order && order.id) {
      await setDoc(doc(db, "orders", order.id.toString()), order);
      console.log("Замовлення збережено:", order.id);

      for (const item of order.products) {
        if (item.sku) {
          const productQuery = query(
            collection(db, "products"),
            where("id", "==", item.sku)
          );
          const productSnapshot = await getDocs(productQuery);

          if (!productSnapshot.empty) {
            const product = productSnapshot.docs[0].data();
            await updateAccessoriesQuantity(product, item.quantity.toFixed(2)); // Rounded to 2 decimal places
          } else {
            console.log(
              `Товар з SKU ${item.sku} не знайдено у колекції products`
            );
          }
        } else {
          console.log(`SKU не вказано для товару в замовленні ${order.id}`);
        }
      }
      // await checkCriticalAccessories();
    } else {
      console.error("Замовлення не містить id або є undefined:", order);
    }
  } catch (error) {
    console.error("Помилка при збереженні замовлення:", error);
  }
};

// Функція для отримання всіх замовлень сторінка за сторінкою
const fetchAllOrdersWithStatus = async () => {
  let page = 1;
  let hasMoreOrders = true;

  while (hasMoreOrders) {
    const response = await axios.get(
      `${API_URL}?limit=50&page=${page}&sort=id&filter%5Bstatus_id%5D=8`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const orders = response.data.data;

    if (orders.length > 0) {
      for (const order of orders) {
        const isInDatabase = await isOrderInDatabase(order.id);

        if (!isInDatabase) {
          const detailedOrder = await fetchOrderById(order.id);
          await saveOrderToFirebase(detailedOrder);
        } else {
          console.log(`Замовлення з ID ${order.id} вже існує в базі.`);
        }
      }
      page++;
    } else {
      hasMoreOrders = false;
    }
  }
};

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Перевірка нових замовлень кожні 15 секунд
setInterval(() => {
  console.log("Перевірка нових замовлень...");
  fetchAllOrdersWithStatus();
}, 15000);

// Перевірка критичного залишку комплектуючих кожні 24 години
setInterval(() => {
  console.log("Перевірка критичного залишку комплектуючих...");
  checkCriticalAccessories();
}, 86400000); // 24 години = 86,400,000 мс
