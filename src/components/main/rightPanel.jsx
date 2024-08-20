import css from "./main.module.css";
import AccessoriesList from "./product/accessoriesList";
import AddAccessories from "./product/addAccessories";
import CriticalAccessoriesList from "./product/criticalAccessoriesList";
import MasAddProdToFirebase from "./product/masAddProdToFirebase";
import OrderDetails from "./product/orderDetails";
import OrdersList from "./product/ordersList";
import ProductList from "./product/product";
const RightPanel = ({
  productComponent,
  acsesuarsCom,
  criticalAcces,
  orderList,
}) => {
  return (
    <div className={css.rightPanelWrap}>
      {productComponent && <ProductList />}
      {acsesuarsCom && <AccessoriesList />}
      {criticalAcces && <CriticalAccessoriesList />}
      {orderList && <OrdersList />}
      {/* <OrderDetails /> */}
      {/* <AddAccessories /> */}
      {/* <MasAddProdToFirebase /> */}
    </div>
  );
};
export default RightPanel;
