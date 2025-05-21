import React, { useState } from "react";

export default function SmartSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/smart-search/?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("搜尋失敗");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || "搜尋失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setQuery(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) handleSearch();
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">AI 智慧搜尋</h2>
          <p className="text-center text-muted mb-4">
            輸入商品關鍵字，體驗 AI 智慧搜尋功能。
          </p>
          <form className="text-center" onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="請輸入商品關鍵字或描述"
              name="query"
              value={query}
              onChange={handleInputChange}
              disabled={loading}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "搜尋中..." : "搜尋"}
            </button>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="mt-4">
            {results.length > 0 ? (
              <ul className="list-group">
                {results.map((item) => (
                  <li className="list-group-item" key={item.id}>
                    <strong>{item.name}</strong>
                    <div className="text-muted small">{item.category}</div>
                    <div>{item.description}</div>
                    <div className="fw-bold">${item.price}</div>
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
