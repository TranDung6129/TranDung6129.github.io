import React, { useState } from 'react';

const KalmanFilterSim = () => {
  const [q, setQ] = useState(0.1);
  const [r, setR] = useState(1.0);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', background: 'var(--code-bg-color)' }}>
      <h3 style={{ marginTop: 0 }}>Kalman Filter 1D Simulation (Test Component)</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          Process Noise (Q): {q}
          <br/>
          <input 
            type="range" 
            min="0" max="2" step="0.05" 
            value={q} 
            onChange={e => setQ(parseFloat(e.target.value))} 
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>
          Measurement Noise (R): {r}
          <br/>
          <input 
            type="range" 
            min="0.1" max="5" step="0.1" 
            value={r} 
            onChange={e => setR(parseFloat(e.target.value))} 
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <div style={{ 
        padding: '15px', 
        background: '#1e1e1e', 
        color: '#00ff00', 
        borderRadius: '4px',
        fontFamily: 'monospace'
      }}>
        [Simulation Output]
        <br/>
        Estimated State: {(10 + q - r/2).toFixed(2)} (Mock Data)
        <br/>
        Kalman Gain: {(q / (q + r)).toFixed(3)}
      </div>
      
      <p style={{ fontSize: '0.9em', color: 'gray', marginTop: '10px' }}>
        * Đây là component React được compile bằng esbuild ngay trong Hugo!
      </p>
    </div>
  );
};

export default KalmanFilterSim;
