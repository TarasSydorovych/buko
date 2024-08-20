import { useState } from "react";
import LeftPanel from "./leftPanel";
import css from "./main.module.css";
import RightPanel from "./rightPanel";
const Main = () => {
  const [productComponent, setProductComponent] = useState(false);
  const [acsesuarsCom, setAcsesuarsCom] = useState(false);
  const [criticalAcces, setCriticalAcces] = useState(false);
  const [orderList, setOrderList] = useState(false);
  return (
    <div className={css.mainWrap}>
      <LeftPanel
        setProductComponent={setProductComponent}
        setAcsesuarsCom={setAcsesuarsCom}
        setCriticalAcces={setCriticalAcces}
        setOrderList={setOrderList}
      />
      <RightPanel
        productComponent={productComponent}
        acsesuarsCom={acsesuarsCom}
        criticalAcces={criticalAcces}
        orderList={orderList}
      />
    </div>
  );
};
export default Main;
