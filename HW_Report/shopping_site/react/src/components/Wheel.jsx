import React, { useRef, useState } from 'react'; // 移除 useEffect 和 useContext
import './Wheel.css';
// import axios from 'axios'; // 移除 axios
// import { AuthContext } from '../context/AuthContext'; // 移除 AuthContext

// 恢復前端硬編碼的 prizes 陣列
const prizes = [
  { label: '獎品A', color: '#FFFACD' }, // 檸檬雪紡 (LemonChiffon)
  { label: '獎品B', color: '#FFDAB9' }, // 桃色泡芙 (PeachPuff)
  { label: '獎品C', color: '#FFB6C1' }, // 淡粉紅 (LightPink)
  { label: '獎品D', color: '#ADD8E6' }, // 淡藍 (LightBlue)
  { label: '獎品E', color: '#98FB98' }, // 淡綠 (PaleGreen)
  { label: '獎品F', color: '#E6E6FA' }, // 薰衣草色 (Lavender)
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function Wheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);
  const [currentAngle, setCurrentAngle] = useState(0); // 追蹤輪盤的總旋轉角度
  // 移除與後端連動相關的狀態
  // const { currentUser } = useContext(AuthContext);
  // const [spinChances, setSpinChances] = useState(null);
  // const [spinError, setSpinError] = useState('');
  // const [prizes, setPrizes] = useState([]); // 改回使用靜態 prizes
  // const [loadingPrizes, setLoadingPrizes] = useState(true);
  // const [prizeError, setPrizeError] = useState('');

  // SVG 輪盤尺寸設定
  const wheelSize = 300; // 輪盤直徑
  const radius = wheelSize / 2 - 5; // 扇形半徑，留一點邊緣空間 (SVG path stroke在內外各佔一半寬度)
  const cx = wheelSize / 2; // SVG 中心點 X
  const cy = wheelSize / 2; // SVG 中心點 Y

  // numPrizes 和 segmentAngleDeg 直接使用靜態 prizes 計算
  const numPrizes = prizes.length;
  const segmentAngleDeg = numPrizes > 0 ? 360 / numPrizes : 0;

  // 產生 SVG 扇形路徑 (d 屬性)
  function generateSlicePath(sliceCx, sliceCy, sliceRadius, startAngle, endAngle) {
    // 將角度轉換為 SVG 的弧度系統 (0 度在 3 點鐘方向，順時針為正)
    // 我們這裡的 startAngle/endAngle 是以 12 點鐘為 0 度，順時針為正
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = sliceCx + sliceRadius * Math.cos(startRad); // 起始點 X
    const y1 = sliceCy + sliceRadius * Math.sin(startRad); // 起始點 Y
    const x2 = sliceCx + sliceRadius * Math.cos(endRad);   // 結束點 X
    const y2 = sliceCy + sliceRadius * Math.sin(endRad);   // 結束點 Y
    const largeArcFlag = (endAngle - startAngle) <= 180 ? '0' : '1'; // 判斷是優弧還是劣弧
    return `M ${sliceCx},${sliceCy} L ${x1},${y1} A ${sliceRadius},${sliceRadius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
  }

  // 移除 getCookie, fetchSpinChances, recordSpinResult 函數

  const spin = () => {
    // 簡化 spin 邏輯，不再檢查抽獎次數或獎品載入狀態
    if (spinning || prizes.length === 0) {
      return;
    }
    setSpinning(true);
    setResult(null);
    // setSpinError(''); // 移除 spinError 相關邏輯
    const prizeIndex = getRandomInt(numPrizes); // 使用 numPrizes
    const selectedPrize = prizes[prizeIndex];

    // 讓每次都從目前角度繼續旋轉
    // 計算目標獎品區塊的中心角度 (0 度在最上方，順時針增加)
    const targetSegmentMidpoint = (segmentAngleDeg * prizeIndex) + (segmentAngleDeg / 2);
    // 計算輪盤總共需要旋轉到的角度
    // currentAngle - (currentAngle % 360) 是為了標準化起始角度到最近的 360 倍數
    // (360 * 5) 是額外旋轉的圈數
    const rotateTo = currentAngle - (currentAngle % 360) + (360 * 5) + targetSegmentMidpoint;
    setCurrentAngle(rotateTo);
    wheelRef.current.style.transition = 'transform 3.5s cubic-bezier(0.215, 0.61, 0.355, 1)';
    wheelRef.current.style.transform = `rotate(-${rotateTo}deg)`;
    setTimeout(() => {
      setSpinning(false);
      setResult(selectedPrize.label);
      // recordSpinResult(selectedPrize.label); // 移除記錄獎品邏輯
    }, 3500); // 需與 CSS transition duration 一致
  };

  // 移除獎品載入、錯誤、無獎品的條件渲染
  if (prizes.length === 0) {
    return <div className="wheel-container"><p>目前沒有可抽獎的獎品。</p></div>;
  }

  return (
    <div className="wheel-container">
      <div className="wheel-assembly" style={{ width: wheelSize, height: wheelSize }}>
        <div className="wheel-shadow"></div> {/* 用於CSS陰影效果 */}
        <svg
          className="wheel" // SVG 元素本身
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${wheelSize} ${wheelSize}`} // SVG 內部座標系統
        >
          {/* 這個 <g> 元素將會被旋轉 */}
          <g ref={wheelRef} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {/* 使用從狀態中獲取的 prizes 陣列來渲染 */}
          {prizes.map((prize, index) => {
            const startAngle = segmentAngleDeg * index; // 該扇形的起始角度
            const endAngle = segmentAngleDeg * (index + 1); // 該扇形的結束角度
            const pathD = generateSlicePath(cx, cy, radius, startAngle, endAngle);

            // 計算文字位置：位於扇形弧度的中點，並向內偏移一些
            const midAngle = startAngle + segmentAngleDeg / 2;
            const textRadius = radius * 0.65; // 文字距離圓心的距離 (調整為65%以求更好置中)
            // 轉換為 SVG 座標 (-90度偏移，因為SVG角度從水平右方開始)
            const textX = cx + textRadius * Math.cos((midAngle - 90) * Math.PI / 180);
            const textY = cy + textRadius * Math.sin((midAngle - 90) * Math.PI / 180);

            return (
              <g key={prize.id || index} className="segment-group"> {/* 優先使用 prize.id 作為 key */}
                <path
                  className="segment-path"
                  d={pathD}
                  fill={prize.color} // 使用從 API 獲取的顏色
                  stroke="#FFFFFF" // 扇形間的白色邊界
                  strokeWidth="1.5" // 邊界寬度
                />
                <text
                  x={textX}
                  y={textY}
                  transform={`rotate(${midAngle} ${textX} ${textY})`} // 使文字隨扇形旋轉
                  textAnchor="middle" // 水平居中
                  dominantBaseline="middle" // 垂直居中
                  className="segment-label"
                >
                  {prize.label} {/* 使用從 API 獲取的標籤 */}
                </text>
              </g>
            );
          })}
          </g>
        </svg>
        <div className="pointer-container">
          <svg className="pointer-svg" viewBox="0 0 40 50">
            <polygon points="20,22 10,2 30,2" fill="#e74c3c" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      </div>
      {/* 移除顯示抽獎次數和錯誤訊息的 UI */}
      <button
        onClick={spin}
        disabled={spinning || prizes.length === 0} // 簡化禁用邏輯
        className="spin-btn"
      >
        {spinning ? '旋轉中...' : '開始抽獎'} {/* 簡化按鈕文字 */}
      </button>
      {result && <div className="result">恭喜你獲得：{result}</div>}
    </div>
  );
}

export default Wheel;
