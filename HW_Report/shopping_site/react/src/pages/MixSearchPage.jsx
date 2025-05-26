import React, { useState } from "react";

export default function MixSearchPage() {
  const [imageFile, setImageFile] = useState(null);
  const [prompt, setPrompt] = useState("");           // ➊ 新增文字 prompt
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => setImageFile(e.target.files[0]);
  const handlePromptChange = (e) => setPrompt(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("prompt", prompt);              // ➋ 一併送出 prompt

      const res = await fetch("/api/products/mix-search/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("搜尋失敗");
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
          <h2 className="card-title text-center mb-4">圖片 + 文字混合搜尋</h2>

          {/* 說明 */}
          <p className="text-center text-muted mb-4">
            上傳商品圖片，可再輸入顏色、樣式等需求，例如：「想要白色」。
          </p>

          {/* 上傳表單 */}
          <form className="text-center" onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              className="form-control mb-2"
              onChange={handleImageChange}
              disabled={loading}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="額外需求（可留空）"
              value={prompt}
              onChange={handlePromptChange}
              disabled={loading}
            />

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !imageFile}
            >
              {loading ? "搜尋中..." : "搜尋"}
            </button>
          </form>

          {/* 錯誤提示 */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}

          {/* 結果列表 */}
          <div className="mt-4">
            {results.length > 0 ? (
              <ul className="list-group">
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex align-items-start"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-thumbnail me-3"
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
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
              !loading && (
                <div className="text-center text-muted">無搜尋結果</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
