import { useState } from 'react';
import './App.css';
import QRCode from "react-qr-code";

function App() {
  const [elementID, setElementID] = useState('');
  const [dmpData, setDmpData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDMP = async () => {
    if (!elementID) return;
    setLoading(true);
    setDmpData(null);

    try {
      const res = await fetch(`http://localhost:3000/passport?id=${elementID}`);
      const json = await res.json();
      setDmpData(json[0]);
    } catch (err) {
      alert("Error fetching data.");
    }

    setLoading(false);
  };

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

          {/* ✅ QR Code Block FIXED */}
          <div style={{ marginTop: '2rem' }}>
            <h4>QR Code for this Material</h4>
            <QRCode
              value={`http://localhost:5173?id=${dmpData["Element ID"]}`} 
              size={180}
              includeMargin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;