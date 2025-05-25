import React from "react";
import Wheel from "./Wheel";
import styles from "./WheelModal.module.css";

const WheelModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2>每日優惠</h2>
        <Wheel />
      </div>
    </div>
  );
};

export default WheelModal;
