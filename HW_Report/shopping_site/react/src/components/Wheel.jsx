import React, { useRef, useState, useEffect } from 'react';
import './Wheel.css';

// prizes will be fetched from backend

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function Wheel() {
  const [prizes, setPrizes] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [spinChances, setSpinChances] = useState(null);
  const wheelRef = useRef(null);
  const [currentAngle, setCurrentAngle] = useState(0);

  // SVG 輪盤尺寸設定
  const wheelSize = 300;
  const radius = wheelSize / 2 - 5;
  const cx = wheelSize / 2;
  const cy = wheelSize / 2;

  const numPrizes = prizes.length;
  const segmentAngleDeg = numPrizes > 0 ? 360 / numPrizes : 0;

  // Fetch prizes and user spin info from backend
  useEffect(() => {
    // Fetch prizes (if you have a prize API, otherwise hardcode or remove)
    fetch("http://localhost:8000/api/wheel/prizes/")
      .then((res) => res.json())
      .then(setPrizes);

    // Fetch user spin info (spin_chances, last_prize)
    fetch("http://localhost:8000/api/accounts/profile/", {
      credentials: "include",
    })
      .then((res) => {
        console.log("Profile API response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Profile API response data:", data);
        console.log("Initial spin chances:", data.spin_chances);
        setSpinChances(data.spin_chances);
        // Optionally set last prize or other info if needed
      })
      .catch((error) => {
        console.error("Profile fetch error:", error);
      });
  }, []);

  // 產生 SVG 扇形路徑 (d 屬性)
  function generateSlicePath(
    sliceCx,
    sliceCy,
    sliceRadius,
    startAngle,
    endAngle,
  ) {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = sliceCx + sliceRadius * Math.cos(startRad);
    const y1 = sliceCy + sliceRadius * Math.sin(startRad);
    const x2 = sliceCx + sliceRadius * Math.cos(endRad);
    const y2 = sliceCy + sliceRadius * Math.sin(endRad);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${sliceCx},${sliceCy} L ${x1},${y1} A ${sliceRadius},${sliceRadius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
  }

  // 移除 getCookie, fetchSpinChances, recordSpinResult 函數

  const spin = () => {
    if (spinning || prizes.length === 0 || spinChances <= 0) {
      return;
    }
    setSpinning(true);
    setResult(null);
    const prizeIndex = getRandomInt(numPrizes);
    const selectedPrize = prizes[prizeIndex];

    // Calculate the segment's angular range
    const segmentStart = segmentAngleDeg * prizeIndex;
    const segmentEnd = segmentAngleDeg * (prizeIndex + 1);

    // Pick a random angle within the segment (avoid edges for clarity)
    const margin = segmentAngleDeg * 0.15; // 15% margin on each side
    const randomWithinSegment =
      segmentStart + margin + Math.random() * (segmentAngleDeg - 2 * margin);

    // Calculate the total rotation needed
    const rotateTo =
      currentAngle - (currentAngle % 360) + 360 * 5 + randomWithinSegment;
    setCurrentAngle(rotateTo);
    wheelRef.current.style.transition =
      "transform 3.5s cubic-bezier(.22,1.5,.36,1)";
    wheelRef.current.style.transform = `rotate(-${rotateTo}deg)`;
    setTimeout(() => {
      setSpinning(false);
      setResult(selectedPrize.label);

      // Record spin result to backend and update spin chances
      const csrfToken = getCookie('csrftoken');
      fetch("http://localhost:8000/api/accounts/spin/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ prize: selectedPrize.label }),
      })
        .then((res) => {
          console.log("Spin API response status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("Spin API response data:", data);
          if (data.error) {
            console.error("Spin API error:", data.error);
          } else if (typeof data.spin_chances !== "undefined") {
            console.log("Updating spin chances from", spinChances, "to", data.spin_chances);
            setSpinChances(data.spin_chances);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }, 3500);
  };

  if (prizes.length === 0) {
    return (
      <div className="wheel-container">
        <p>目前沒有可抽獎的獎品。</p>
      </div>
    );
  }

  return (
    <div className="wheel-container">
      <div
        className="wheel-assembly"
        style={{ width: wheelSize, height: wheelSize }}
      >
        <div className="wheel-shadow"></div>
        <svg
          className="wheel"
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
        >
          <defs>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="3"
                floodColor="#fff"
                floodOpacity="0.7"
              />
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="6"
                floodColor="#43cea2"
                floodOpacity="0.25"
              />
            </filter>
            {prizes.map((prize, index) => {
              const gradId = `grad${index}`;
              const color1 = prize.color;
              const color2 = "#fff";
              return (
                <linearGradient
                  id={gradId}
                  key={gradId}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={color1} stopOpacity="1" />
                  <stop offset="100%" stopColor={color2} stopOpacity="0.7" />
                </linearGradient>
              );
            })}
          </defs>
          <g ref={wheelRef} style={{ transformOrigin: `${cx}px ${cy}px` }}>
            {prizes.map((prize, index) => {
              const startAngle = segmentAngleDeg * index;
              const endAngle = segmentAngleDeg * (index + 1);
              const pathD = generateSlicePath(
                cx,
                cy,
                radius,
                startAngle,
                endAngle,
              );

              const midAngle = startAngle + segmentAngleDeg / 2;
              const textRadius = radius * 0.65;
              const textX =
                cx + textRadius * Math.cos(((midAngle - 90) * Math.PI) / 180);
              const textY =
                cy + textRadius * Math.sin(((midAngle - 90) * Math.PI) / 180);

              return (
                <g key={prize.id || index} className="segment-group">
                  <path
                    className="segment-path"
                    d={pathD}
                    fill={`url(#grad${index})`}
                    stroke="#fff"
                    strokeWidth="2.5"
                    filter="url(#glow)"
                  />
                  <text
                    x={textX}
                    y={textY}
                    transform={`rotate(${midAngle} ${textX} ${textY})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="segment-label"
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        <div className="pointer-container">
          <svg className="pointer-svg" viewBox="0 0 40 50">
            <polygon
              points="20,22 10,2 30,2"
              fill="#e74c3c"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
      <div style={{ marginTop: 16, fontWeight: 500 }}>
        剩餘抽獎次數: {spinChances !== null ? spinChances : "載入中..."}
      </div>
      <button
        onClick={spin}
        disabled={spinning || prizes.length === 0 || spinChances <= 0}
        className="spin-btn"
      >
        {spinning ? "旋轉中..." : spinChances > 0 ? "開始抽獎" : "沒有抽獎次數"}
      </button>
      {result && <div className="result">恭喜你獲得：{result}</div>}
      {/* You can remove or repurpose the spin history section since it's not tracked in the new backend */}
    </div>
  );
}

export default Wheel;
