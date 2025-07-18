import { useState } from 'react';
import './AddMaterial.css';

function AddMaterial({ onBack }) {
  const [formData, setFormData] = useState({
    elementId: '',
    type: '',
    volume: '',
    materialOrigin: '',
    embodiedCarbon: '',
    lifespan: '',
    fireRating: '',
    installationDate: '',
    manufacturer: '',
    recycledContent: '',
    weight: '',
    exchangeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log("Submitting form data:", formData);

      // Prepare data for blockchain
      const materialData = {
        elementId: formData.elementId,
        type: formData.type,
        volume: formData.volume,
        materialOrigin: formData.materialOrigin,
        embodiedCarbon: formData.embodiedCarbon,
        lifespan: formData.lifespan,
        fireRating: formData.fireRating,
        installationDate: formData.installationDate,
        manufacturer: formData.manufacturer,
        recycledContent: formData.recycledContent,
        weight: formData.weight,
        exchangeId: formData.exchangeId
      };

      console.log("Sending to backend:", materialData);

      // Try localhost first, then fallback to deployed backend
      let response;
      try {
        response = await fetch('http://localhost:3000/add-material', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(materialData)
        });
      } catch (localError) {
        console.log("Local server not available, trying deployed backend...");
        response = await fetch('https://dmp-backend-gcoq.onrender.com/add-material', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(materialData)
        });
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to add material to blockchain');
      }

      console.log("Success response:", result);
      setSuccess(`✅ Material added successfully! Element ID: ${formData.elementId}\nTransaction: ${result.transactionHash}`);
      
      // Reset form
      setFormData({
        elementId: '',
        type: '',
        volume: '',
        materialOrigin: '',
        embodiedCarbon: '',
        lifespan: '',
        fireRating: '',
        installationDate: '',
        manufacturer: '',
        recycledContent: '',
        weight: '',
        exchangeId: ''
      });

    } catch (err) {
      console.error("Error submitting form:", err);
      setError(`❌ Error: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="add-material-container">
      <div className="add-material-card">
        <div className="card-header">
          {onBack && (
            <button onClick={onBack} className="back-btn">
              ← Back to Viewer
            </button>
          )}
          <h2>🏗️ Add New Material to Blockchain</h2>
          <p>Enter unique Element ID from your app and fill material details</p>
        </div>

        <form onSubmit={handleSubmit} className="material-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="elementId">Element ID *</label>
              <input
                type="text"
                id="elementId"
                name="elementId"
                value={formData.elementId}
                onChange={handleInputChange}
                placeholder="Enter unique Element ID from your app"
                required
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.elementId || 'Not entered'}</small>
            </div>

            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="e.g., 12 x 24"
                required
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.type || 'Not entered'}</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="volume">Volume *</label>
              <input
                type="text"
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                placeholder="e.g., 17.00 CF"
                required
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.volume || 'Not entered'}</small>
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 150 kg"
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.weight || 'Not entered'}</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="manufacturer">Manufacturer *</label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                placeholder="e.g., Tata Steel UK"
                required
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.manufacturer || 'Not entered'}</small>
            </div>

            <div className="form-group">
              <label htmlFor="materialOrigin">Material Origin *</label>
              <input
                type="text"
                id="materialOrigin"
                name="materialOrigin"
                value={formData.materialOrigin}
                onChange={handleInputChange}
                placeholder="e.g., Port Talbot Mill"
                required
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.materialOrigin || 'Not entered'}</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="embodiedCarbon">Embodied Carbon (kgCO₂e/kg) *</label>
              <input
                type="number"
                step="0.1"
                id="embodiedCarbon"
                name="embodiedCarbon"
                value={formData.embodiedCarbon}
                onChange={handleInputChange}
                placeholder="e.g., 2.6"
                required
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.embodiedCarbon || 'Not entered'}</small>
            </div>

            <div className="form-group">
              <label htmlFor="recycledContent">Recycled Content (%) *</label>
              <input
                type="number"
                min="0"
                max="100"
                id="recycledContent"
                name="recycledContent"
                value={formData.recycledContent}
                onChange={handleInputChange}
                placeholder="e.g., 45"
                required
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.recycledContent || 'Not entered'}%</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lifespan">Estimated Lifespan (years) *</label>
              <input
                type="number"
                id="lifespan"
                name="lifespan"
                value={formData.lifespan}
                onChange={handleInputChange}
                placeholder="e.g., 60"
                required
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.lifespan || 'Not entered'} years</small>
            </div>

            <div className="form-group">
              <label htmlFor="fireRating">Fire Rating</label>
              <input
                type="text"
                id="fireRating"
                name="fireRating"
                value={formData.fireRating}
                onChange={handleInputChange}
                placeholder="e.g., Class A"
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.fireRating || 'Not entered'}</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="installationDate">Installation Date</label>
              <input
                type="date"
                id="installationDate"
                name="installationDate"
                value={formData.installationDate}
                onChange={handleInputChange}
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.installationDate || 'Not set'}</small>
            </div>

            <div className="form-group">
              <label htmlFor="exchangeId">Exchange ID</label>
              <input
                type="text"
                id="exchangeId"
                name="exchangeId"
                value={formData.exchangeId}
                onChange={handleInputChange}
                placeholder="Optional"
                className="form-input"
                style={{
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <small className="field-preview">Current: {formData.exchangeId || 'Not entered'}</small>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message" style={{whiteSpace: 'pre-line'}}>{success}</div>}

          <div className="form-summary">
            <h3>📋 Form Summary</h3>
            <div className="summary-grid">
              <p><strong>Element ID:</strong> {formData.elementId || '❌ Required'}</p>
              <p><strong>Type:</strong> {formData.type || '❌ Required'}</p>
              <p><strong>Volume:</strong> {formData.volume || '❌ Required'}</p>
              <p><strong>Manufacturer:</strong> {formData.manufacturer || '❌ Required'}</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '🔄 Adding to Blockchain...' : '🚀 Add Material to Blockchain'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMaterial;