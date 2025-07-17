import { useState, useEffect } from 'react';
import './App.css';
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";

function App() {
  const [elementID, setElementID] = useState('');
  const [dmpData, setDmpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // ✅ Fetch by ID
  const fetchDMPById = async (id) => {
    setLoading(true);
    setDmpData(null);

    try {
      const res = await fetch(`http://localhost:3000/passport?id=${id}`);
      const json = await res.json();
      setDmpData(json[0]);
    } catch (err) {
      alert("Error fetching data.");
    }

    setLoading(false);
  };

  // ✅ Manual fetch (button click)
  const fetchDMP = () => {
    if (!elementID) return;
    fetchDMPById(elementID);
  };

  // ✅ Auto-fetch on URL load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromURL = params.get("id");
    if (idFromURL) {
      setElementID(idFromURL);
      fetchDMPById(idFromURL);
    }
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Material Passport Viewer</h1>

      <input
        type="text"
        placeholder="Enter Element ID"
        value={elementID}
        onChange={(e) => setElementID(e.target.value)}
        style={{ padding: '10px', width: '250px' }}
      />
      <button onClick={fetchDMP} style={{ marginLeft: '10px', padding: '10px' }}>
        Fetch
      </button>

      {loading && <p>Loading...</p>}

      {dmpData && (
        <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3>DMP for Element ID: {dmpData["Element ID"]}</h3>
          <p><strong>Type:</strong> {dmpData.Type}</p>
          <p><strong>Volume:</strong> {dmpData.Volume}</p>
          <p><strong>Manufacturer:</strong> {dmpData.Manufacturer}</p>
          <p><strong>Material Origin:</strong> {dmpData["Material Origin"]}</p>
          <p><strong>Embodied Carbon:</strong> {dmpData["Embodied Carbon"]}</p>
          <p><strong>Lifespan:</strong> {dmpData.Lifespan}</p>
          <p><strong>Recycled Content:</strong> {dmpData["Recycled Content"]}</p>

          {/* ✅ QR Code */}
          <div style={{ marginTop: '2rem' }}>
            <h4>QR Code for this Material</h4>
            <QRCode
              value={`https://dmp-viewer.vercel.app?id=${dmpData["Element ID"]}`}
              style={{ height: 180, width: 180 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;