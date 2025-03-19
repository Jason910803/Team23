import React from 'react';
function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div className="counter">
      <p>你點擊了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>
        點擊我
      </button>
    </div>
  );
}
export default Counter;
