import React from "react";
import Wheel from "../components/Wheel";

function SpinPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2>登入成功！來抽個獎吧！</h2>
      <Wheel />
    </div>
  );
}

export default SpinPage;
