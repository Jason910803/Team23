import React, { useState } from "react";

export default function ImageSearchPage() {
  const [imageFile, setImageFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/products/image-search/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("圖片搜尋失敗");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || "搜尋失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">以圖搜商品</h2>
          <p className="text-center text-muted mb-4">
            上傳一張商品圖片，體驗 AI 以圖搜商品功能。
          </p>
          <form className="text-center" onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              className="form-control mb-3"
              onChange={handleImageChange}
              disabled={loading}
            />
            <button className="btn btn-primary" type="submit" disabled={loading || !imageFile}>
              {loading ? "搜尋中..." : "搜尋"}
            </button>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="mt-4">
            {results.length > 0 ? (
              <ul className="list-group">
                {results.map((item) => (
                  <li
                    className="list-group-item d-flex align-items-start"  /* ❶ 讓圖片文字同一行 */
                    key={item.id}
                  >
                    {/* ❷ 商品縮圖 */}
                    <img
                    src={item.image}        // 後端傳回的 URL
                    alt={item.name}
                    className="img-thumbnail me-3"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />

                    {/* ❸ 文字資訊包一個 div */}
                    <div>
                    <a
                        href={`/product/${item.id}`}
                        className="fw-semibold text-decoration-none"
                    >
                        {item.name}
                    </a>
                    <div className="text-muted small">{item.category}</div>
                    <div className="small">{item.description}</div>
                    <div className="fw-bold">${item.price}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && <div className="text-center text-muted">無搜尋結果</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
