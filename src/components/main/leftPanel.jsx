import { useState } from "react";
import css from "./main.module.css";

const LeftPanel = ({
  setProductComponent,
  setAcsesuarsCom,
  setCriticalAcces,
  setOrderList,
}) => {
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (index) => {
    setActiveItem(index);
    if (index === 0) {
      setProductComponent(true);
      setAcsesuarsCom(false);
      setCriticalAcces(false);
      setOrderList(false);
    } else if (index === 1) {
      setProductComponent(false);
      setAcsesuarsCom(true);
      setCriticalAcces(false);
      setOrderList(false);
    } else if (index === 2) {
      setProductComponent(false);
      setAcsesuarsCom(false);
      setCriticalAcces(false);
      setOrderList(true);
    } else if (index === 3) {
      setProductComponent(false);
      setAcsesuarsCom(false);
      setCriticalAcces(true);
      setOrderList(false);
    }
  };

  return (
    <div className={css.leftPanelWrap}>
      <p className={css.menu}>Список Вкладок</p>
      <div
        className={activeItem === 0 ? css.wrapMenuLClick : css.wrapMenuL}
        onClick={() => handleClick(0)}
      >
        Товари
      </div>
      <div
        className={activeItem === 1 ? css.wrapMenuLClick : css.wrapMenuL}
        onClick={() => handleClick(1)}
      >
        Комплектуючі
      </div>
      <div
        className={activeItem === 2 ? css.wrapMenuLClick : css.wrapMenuL}
        onClick={() => handleClick(2)}
      >
        Замовлення
      </div>
      <div
        className={activeItem === 3 ? css.wrapMenuLClick : css.wrapMenuL}
        onClick={() => handleClick(3)}
      >
        Критичний залишок
      </div>
    </div>
  );
};

export default LeftPanel;
