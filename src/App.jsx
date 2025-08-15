import './App.css';
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import AddMaterial from './AddMaterial';

function App() {
  const [currentView, setCurrentView] = useState('viewer'); // 'viewer' or 'add'
  const [elementID, setElementID] = useState('');
  const [dmpData, setDmpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const qrRef = useRef(null);

  // Fetch from local public/dmp-data.json and find matching elementID
  const fetchDMPById = async (id) => {
    setLoading(true);
    setDmpData(null);
    setError('');

    try {
      const res = await fetch('/dmp-data.json');
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const list = await res.json();
      // Normalize id to string for matching
      const idStr = String(id).trim();
      const found = Array.isArray(list)
        ? list.find(item => String(item.elementID) === idStr || String(item.elementId) === idStr)
        : null;

      if (found) {
        setDmpData(found);
      } else {
        setError('No data found for this Element ID');
      }
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDMP = () => {
    if (!elementID.trim()) {
      setError('Please enter a valid Element ID');
      return;
    }
    fetchDMPById(elementID.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchDMP();
    }
  };

  // Download QR by converting the qrRef DOM node to PNG using dynamic import
  const downloadQR = async () => {
    if (!qrRef.current || !dmpData) return;

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(qrRef.current, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Material-Passport-QR-${dmpData.elementID || dmpData.elementId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Failed to download QR code');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromURL = params.get('id');
    if (idFromURL) {
      setElementID(idFromURL);
      fetchDMPById(idFromURL);
      setCurrentView('viewer'); // Ensure we're on viewer when accessing via QR
    }
  }, [location.search]);

  // If AddMaterial view is selected, render AddMaterial component
  if (currentView === 'add') {
    return <AddMaterial onBack={() => setCurrentView('viewer')} />;
  }

  // Main App (Viewer) Component
  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navigation">
        <button 
          onClick={() => setCurrentView('viewer')} 
          className={currentView === 'viewer' ? 'nav-btn active' : 'nav-btn'}
        >
          🔍 View Passport
        </button>
        <button 
          onClick={() => setCurrentView('add')} 
          className={currentView === 'add' ? 'nav-btn active' : 'nav-btn'}
        >
          ➕ Add Material
        </button>
      </nav>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">🏗️ Digital Material Passport</h1>
          <p className="subtitle">Blockchain-powered material traceability</p>
        </div>
      </header>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Element ID (e.g., 579024)"
              value={elementID}
              onChange={(e) => setElementID(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button 
              onClick={fetchDMP} 
              disabled={loading}
              className="search-button"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching material data...</p>
        </div>
      )}

      {/* Material Data Display */}
      {dmpData && (
        <div className="data-container">
          <div className="material-card">
            <div className="card-header">
              <h2>Material Passport</h2>
              <span className="element-id">ID: {dmpData.elementID || dmpData.elementId}</span>
            </div>

            <div className="material-info">
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">🏷️ Type</span>
                  <span className="value">{dmpData.type || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">📦 Volume</span>
                  <span className="value">{dmpData.volume_m3 != null ? `${dmpData.volume_m3} m³` : 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">🏭 Manufacturer</span>
                  <span className="value">{dmpData.manufacturer || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">📐 Density</span>
                  <span className="value">{dmpData.density_kg_m3 != null ? `${dmpData.density_kg_m3} kg/m³` : 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">🌱 Recycled</span>
                  <span className="value">{dmpData.recycledContent_percent != null ? `${dmpData.recycledContent_percent}%` : 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">⏳ Lifespan</span>
                  <span className="value">{dmpData.expectedServiceLife_years ? `${dmpData.expectedServiceLife_years} years` : 'N/A'}</span>
                </div>
                <div className="info-item full-width">
                  <span className="label">👤 Owner</span>
                  <span className="value owner-address">{dmpData.owner ? `${dmpData.owner.slice(0,6)}...${dmpData.owner.slice(-4)}` : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="qr-section">
              <h3>📱 Share Material Passport</h3>
              <div className="qr-container">
                <div ref={qrRef} className="qr-code-wrapper">
                  <QRCode
                    value={`https://dmp-viewer.vercel.app?id=${dmpData.elementID || dmpData.elementId}`}
                    size={150}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <button onClick={downloadQR} className="download-button">
                  📥 Download QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Powered by Blockchain • Secure • Transparent</p>
      </footer>
    </div>
  );
}

export default App;