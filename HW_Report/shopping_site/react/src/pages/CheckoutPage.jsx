import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import styles from "./CheckoutPage.module.css";

// Add this CSS if it doesn't exist in module.css
const additionalStyles = `
  .fieldHint {
    display: block;
    color: #6c757d;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
`;

function CheckoutPage({ cart, removeRow }) {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  // Fetch user profile data to auto-fill email
  useEffect(() => {
    if (currentUser) {
      axios
        .get("http://localhost:8000/api/accounts/profile/", {
          withCredentials: true,
        })
        .then((res) => {
          setFormData((prevData) => ({
            ...prevData,
            email: res.data.email || "",
          }));
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
        });
    }
  }, [currentUser]);

  const [errors, setErrors] = useState({});

  // Only include checked items from cart
  const checkedItems = cart.filter((item) => item.checked);

  // Calculate total
  const total = checkedItems.reduce(
    (sum, product) => sum + product.price * product.amount,
    0,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 送貨資訊驗證
    if (!formData.name.trim()) {
      newErrors.name = "請輸入收件人姓名";
    }

    if (!formData.email.trim()) {
      newErrors.email = "請輸入電子郵件";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "電子郵件格式不正確，請確認格式為 example@domain.com";
    }

    if (!formData.address.trim()) {
      newErrors.address = "請輸入完整的收件地址";
    }

    if (!formData.city.trim()) {
      newErrors.city = "請輸入城市";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "請輸入郵遞區號";
    } else if (!/^\d{3,6}$/.test(formData.zipCode)) {
      newErrors.zipCode = "郵遞區號格式不正確，請輸入3-6位數字";
    }

    // 付款資訊驗證
    const cardNumberWithoutSpaces = formData.cardNumber.replace(/\s/g, "");
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "請輸入信用卡號碼";
    } else if (!/^\d{16}$/.test(cardNumberWithoutSpaces)) {
      newErrors.cardNumber =
        "信用卡號碼必須為16位數字，請確認格式為：XXXX XXXX XXXX XXXX";
    }

    if (!formData.cardExpiry.trim()) {
      newErrors.cardExpiry = "請輸入信用卡到期日";
    } else {
      const [month, year] = formData.cardExpiry.split("/");
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = "請以 MM/YY 格式輸入，如：05/26";
      } else {
        // 檢查日期是否有效
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const expYear = parseInt(year);
        const expMonth = parseInt(month);

        if (
          expYear < currentYear ||
          (expYear === currentYear && expMonth < currentMonth)
        ) {
          newErrors.cardExpiry = "信用卡已過期，請使用有效的信用卡";
        }
      }
    }

    if (!formData.cardCVC.trim()) {
      newErrors.cardCVC = "請輸入信用卡安全碼";
    } else if (!/^\d{3,4}$/.test(formData.cardCVC)) {
      newErrors.cardCVC = "安全碼格式不正確，請輸入卡片背面的3-4位數字";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process order
    // In a real application, you would send the order to your backend
    alert(`訂單已送出！總金額：$${total.toLocaleString()}`);

    // Clear the cart items that were checked out
    checkedItems.forEach((item) => removeRow(item));

    // Navigate back to the home page
    navigate("/home");
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  return (
    <div className={styles.checkoutContainer}>
      <style>{additionalStyles}</style>
      <h1>結帳</h1>

      <div className={styles.checkoutLayout}>
        <div className={styles.orderSummary}>
          <h2>訂單摘要</h2>
          <div className={styles.items}>
            {checkedItems.length > 0 ? (
              checkedItems.map((product) => (
                <div key={product.id} className={styles.item}>
                  <div className={styles.productInfo}>
                    <img src={product.image} alt={product.name} width="50" />
                    <span>{product.name}</span>
                  </div>
                  <div className={styles.productDetails}>
                    <span>數量: {product.amount}</span>
                    <span>
                      ${(product.price * product.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>購物車是空的</p>
            )}
          </div>
          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span>小計:</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div className={styles.totalRow}>
              <span>運費:</span>
              <span>$0</span>
            </div>
            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
              <span>總金額:</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={styles.checkoutForm}>
          <form onSubmit={handleSubmit}>
            <h2>送貨資訊</h2>
            <div className={styles.formGroup}>
              <label htmlFor="name">姓名</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? styles.inputError : ""}
              />
              {errors.name && (
                <div className={styles.errorMessage}>{errors.name}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">電子郵件</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.inputError : ""}
              />
              {errors.email && (
                <div className={styles.errorMessage}>{errors.email}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">地址</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? styles.inputError : ""}
              />
              {errors.address && (
                <div className={styles.errorMessage}>{errors.address}</div>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">城市</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? styles.inputError : ""}
                />
                {errors.city && (
                  <div className={styles.errorMessage}>{errors.city}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="zipCode">郵遞區號</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={errors.zipCode ? styles.inputError : ""}
                />
                {errors.zipCode && (
                  <div className={styles.errorMessage}>{errors.zipCode}</div>
                )}
              </div>
            </div>

            <h2>付款資訊</h2>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">信用卡號碼</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                pattern="\d{4} \d{4} \d{4} \d{4}"
                title="請輸入 16 位數字的信用卡號碼，格式為: XXXX XXXX XXXX XXXX"
                value={formData.cardNumber}
                onChange={(e) => {
                  // Format card number with spaces after every 4 digits
                  const value = e.target.value.replace(/\s/g, "");
                  const formattedValue = value
                    .replace(/\D/g, "")
                    .replace(/(\d{4})(?=\d)/g, "$1 ")
                    .substr(0, 19);

                  setFormData({
                    ...formData,
                    cardNumber: formattedValue,
                  });

                  // Clear error when field is edited
                  if (errors.cardNumber) {
                    setErrors({
                      ...errors,
                      cardNumber: "",
                    });
                  }
                }}
                className={errors.cardNumber ? styles.inputError : ""}
              />
              {errors.cardNumber && (
                <div className={styles.errorMessage}>{errors.cardNumber}</div>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cardExpiry">到期日</label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  maxLength="5"
                  pattern="(0[1-9]|1[0-2])\/\d{2}"
                  title="請以 MM/YY 格式輸入，例如：01/25"
                  value={formData.cardExpiry}
                  onChange={(e) => {
                    // Format expiry date as MM/YY
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 0) {
                      value = value
                        .match(new RegExp(".{1,2}", "g"))
                        .join("/")
                        .substr(0, 5);
                    }

                    setFormData({
                      ...formData,
                      cardExpiry: value,
                    });

                    // Clear error when field is edited
                    if (errors.cardExpiry) {
                      setErrors({
                        ...errors,
                        cardExpiry: "",
                      });
                    }
                  }}
                  className={errors.cardExpiry ? styles.inputError : ""}
                />
                {errors.cardExpiry && (
                  <div className={styles.errorMessage}>{errors.cardExpiry}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cardCVC">安全碼 (CVC)</label>
                <input
                  type="text"
                  id="cardCVC"
                  name="cardCVC"
                  placeholder="123"
                  maxLength="4"
                  pattern="\d{3,4}"
                  title="請輸入卡背面的 3-4 位安全碼"
                  value={formData.cardCVC}
                  onChange={(e) => {
                    // Allow only digits for CVC
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .substr(0, 4);

                    setFormData({
                      ...formData,
                      cardCVC: value,
                    });

                    // Clear error when field is edited
                    if (errors.cardCVC) {
                      setErrors({
                        ...errors,
                        cardCVC: "",
                      });
                    }
                  }}
                  className={errors.cardCVC ? styles.inputError : ""}
                />
                {errors.cardCVC && (
                  <div className={styles.errorMessage}>{errors.cardCVC}</div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                取消
              </button>
              <button type="submit" className={styles.submitButton}>
                確認付款
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
