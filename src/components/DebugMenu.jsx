import React, { useState } from 'react';
import { runSimulationBatch, printSimulationReport } from '../utils/SimulationBench';
import './Modal.css';

export function DebugMenu({ onClose, t = (key, fallback) => fallback || key }) {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(50);

  const runBench = () => {
    setRunning(true);
    setResults(null);
    setTimeout(() => {
      try {
        const res = runSimulationBatch(count, 80);
        setResults(res);
      } catch (e) {
        setResults({ error: e.message });
      }
      setRunning(false);
    }, 50);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>🛠️ Debug Tools</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '16px' }}>
            <label>Simulation batch size: </label>
            <input
              type="number"
              min="10"
              max="1000"
              value={count}
              onChange={e => setCount(Number(e.target.value) || 50)}
              className="text-input"
              style={{ width: '80px', marginLeft: '8px' }}
            />
          </div>

          <button
            className="btn-primary"
            onClick={runBench}
            disabled={running}
            style={{ marginBottom: '16px' }}
          >
            {running ? 'Running...' : `Run ${count} Lives`}
          </button>

          {results && !results.error && (
            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                padding: '12px',
                maxHeight: '400px',
                overflow: 'auto',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                lineHeight: 1.6,
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                === SIMULATION BENCH REPORT ===
              </div>
              <div>Total lives simulated: {results.total}</div>
              <div>
                Deaths: {results.deaths} (
                {results.total > 0
                  ? Math.round((results.deaths / results.total) * 100)
                  : 0}
                %)
              </div>
              <div>Errors: {results.errors.length}</div>
              <div>NaN money bugs: {results.nanMoney}</div>
              <div>NaN stat bugs: {results.nanStats}</div>
              <div>Age bugs: {results.ageBugs}</div>
              <div>Wars fought: {results.warsFought}</div>

              <div style={{ fontWeight: 'bold', marginTop: '12px' }}>Death causes:</div>
              {Object.entries(results.deathCauses)
                .sort((a, b) => b[1] - a[1])
                .map(([cause, n]) => (
                  <div key={cause} style={{ marginLeft: '12px' }}>
                    {cause}: {n}
                  </div>
                ))}

              <div style={{ fontWeight: 'bold', marginTop: '12px' }}>Top jobs at death:</div>
              {Object.entries(results.jobsAtDeath)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([job, n]) => (
                  <div key={job} style={{ marginLeft: '12px' }}>
                    {job}: {n}
                  </div>
                ))}

              <div style={{ marginTop: '12px' }}>
                Avg lifespan:{' '}
                {results.lifespans.length > 0
                  ? Math.round(
                      results.lifespans.reduce((a, b) => a + b, 0) /
                        results.lifespans.length
                    )
                  : 'N/A'}
              </div>
              <div>
                Avg final money: $
                {results.finalMoney.length > 0
                  ? Math.round(
                      results.finalMoney.reduce((a, b) => a + b, 0) /
                        results.finalMoney.length
                    ).toLocaleString()
                  : 'N/A'}
              </div>

              {results.errors.length > 0 && (
                <>
                  <div style={{ fontWeight: 'bold', marginTop: '12px', color: '#f44336' }}>
                    Errors:
                  </div>
                  {results.errors.map((e, i) => (
                    <div key={i} style={{ marginLeft: '12px', color: '#f44336' }}>
                      {e}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {results && results.error && (
            <div style={{ color: '#f44336' }}>Error: {results.error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
