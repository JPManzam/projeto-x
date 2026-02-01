import React, { useState, useEffect } from 'react';

function App() {
  const [config, setConfig] = useState({ keywords: [], associateTag: '', maxProducts: 10 });
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('Idle');

  useEffect(() => {
    fetchConfig();
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/config');
      const data = await res.json();
      setConfig(data);
    } catch (e) { console.error("Config fetch error", e); }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/logs');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (e) { console.error("Logs fetch error", e); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    alert('Configurações atualizadas!');
  };

  const handleRun = async () => {
    setStatus('Scanning...');
    await fetch('http://localhost:3001/api/run', { method: 'POST' });
    setTimeout(() => {
      setStatus('Idle');
      fetchLogs();
    }, 15000);
  };

  return (
    <div className="dashboard">
      <header>
        <div>
          <h1>Control Panel</h1>
          <p style={{ color: 'var(--text-dim)' }}>BMad Affiliate Optimization Engine</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>SYSTEM STATUS</p>
          <p style={{ color: status === 'Idle' ? 'var(--secondary)' : 'var(--accent)', fontWeight: 800 }}>{status.toUpperCase()}</p>
        </div>
      </header>

      <div className="grid">
        <aside className="sidebar card">
          <h2>Core Engine Config</h2>
          <form onSubmit={handleSave}>
            <label>Search Keywords</label>
            <input
              type="text"
              placeholder="Ex: Whey, Creatina"
              value={config.keywords.join(', ')}
              onChange={(e) => setConfig({ ...config, keywords: e.target.value.split(',').map(s => s.trim()) })}
            />

            <label>Associate Tag</label>
            <input
              type="text"
              placeholder="tag-20"
              value={config.associateTag}
              onChange={(e) => setConfig({ ...config, associateTag: e.target.value })}
            />

            <label>Volume per Key</label>
            <input
              type="number"
              value={config.maxProducts}
              onChange={(e) => setConfig({ ...config, maxProducts: parseInt(e.target.value) })}
            />

            <button type="submit" className="btn-primary">Update Database</button>
          </form>

          <div style={{ marginTop: '40px' }}>
            <h2>Manual Override</h2>
            <button onClick={handleRun} className="btn-run" disabled={status !== 'Idle'}>
              {status === 'Idle' ? '🔥 Start Engine' : '⚡ Scanning...'}
            </button>
          </div>
        </aside>

        <main className="results-container">
          <div className="products-grid">
            {products.length > 0 ? products.map((p, i) => (
              <div key={i} className="product-card">
                <div className="image-container">
                  <img src={p.image !== 'N/A' ? p.image : 'https://placehold.co/400x400/030305/white?text=No+Image'} alt={p.title} />
                </div>
                <div className="product-content">
                  <h3>{p.title}</h3>
                  <div className="product-price">{p.price}</div>
                  <a href={p.affiliate_url} target="_blank" rel="noreferrer" className="affiliate-link">
                    💰 GET AFFILIATE LINK
                  </a>
                </div>
              </div>
            )) : <div className="card" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Waiting for engine results...</div>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
