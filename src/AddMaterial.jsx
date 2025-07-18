import { useState } from 'react';
import './AddMaterial.css';

function AddMaterial() {
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

  const generateElementId = () => {
    // Generate a random 6-digit ID starting with 57
    const randomId = Math.floor(Math.random() * 10000) + 570000;
    setFormData(prev => ({
      ...prev,
      elementId: randomId.toString()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
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

      // Call your backend API to add to blockchain
      const response = await fetch('https://dmp-backend-gcoq.onrender.com/add-material', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData)
      });

      if (!response.ok) {
        throw new Error('Failed to add material to blockchain');
      }

      const result = await response.json();
      setSuccess(`Material added successfully! Element ID: ${formData.elementId}`);
      
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
      setError(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="add-material-container">
      <div className="add-material-card">
        <div className="card-header">
          <h2>🏗️ Add New Material to Blockchain</h2>
          <p>Create a new digital material passport</p>
        </div>

        <form onSubmit={handleSubmit} className="material-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="elementId">Element ID</label>
              <div className="input-with-button">
                <input
                  type="text"
                  id="elementId"
                  name="elementId"
                  value={formData.elementId}
                  onChange={handleInputChange}
                  placeholder="e.g., 579024"
                  required
                />
                <button type="button" onClick={generateElementId} className="generate-btn">
                  🎲 Generate
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="e.g., 12 x 24"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="volume">Volume</label>
              <input
                type="text"
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                placeholder="e.g., 17.00 CF"
                required
              />
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
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="manufacturer">Manufacturer</label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                placeholder="e.g., Tata Steel UK"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="materialOrigin">Material Origin</label>
              <input
                type="text"
                id="materialOrigin"
                name="materialOrigin"
                value={formData.materialOrigin}
                onChange={handleInputChange}
                placeholder="e.g., Port Talbot Mill"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="embodiedCarbon">Embodied Carbon (kgCO₂e/kg)</label>
              <input
                type="number"
                step="0.1"
                id="embodiedCarbon"
                name="embodiedCarbon"
                value={formData.embodiedCarbon}
                onChange={handleInputChange}
                placeholder="e.g., 2.6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="recycledContent">Recycled Content (%)</label>
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
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lifespan">Estimated Lifespan (years)</label>
              <input
                type="number"
                id="lifespan"
                name="lifespan"
                value={formData.lifespan}
                onChange={handleInputChange}
                placeholder="e.g., 60"
                required
              />
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
              />
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
              />
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
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '🔄 Adding to Blockchain...' : '🚀 Add Material to Blockchain'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMaterial;