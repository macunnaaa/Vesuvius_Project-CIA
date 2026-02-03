import React, { useState } from 'react';
import axios from 'axios';

function Dashboard({ username }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleAnalyze = async () => {
    if (!file) return alert("Please select a Vesuvius fragment first!");
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze", formData);
      const newResult = res.data.image;
      setResult(newResult);
      
      const historyItem = {
        id: Date.now(),
        fileName: file.name,
        image: newResult,
        time: new Date().toLocaleTimeString()
      };
      setHistory([historyItem, ...history]);
    } catch (error) {
      alert("Analysis failed!");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = (imageData, fileName) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `Vesuvius_Analysis_${fileName}.png`;
    link.click();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#eef2f3', color: '#333', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* ⬅️ Left Sidebar: History */}
      <div style={{ width: '320px', backgroundColor: '#ffffff', borderRight: '1px solid #d1d9e6', padding: '25px', boxShadow: '2px 0 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#E50914', borderBottom: '2px solid #E50914', paddingBottom: '15px', letterSpacing: '1px', textAlign: 'center' }}>ANALYSIS LOG</h3>
        <div style={{ marginTop: '20px' }}>
          {history.length === 0 ? <p style={{ color: '#999', textAlign: 'center' }}>No recent activity.</p> : 
            history.map(item => (
              <div key={item.id} style={{ padding: '15px', background: '#f8f9fa', marginBottom: '15px', borderRadius: '12px', border: '1px solid #e1e8ed' }}>
                <p style={{ fontSize: '11px', color: '#777' }}>{item.time}</p>
                <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '5px 0', color: '#444' }}>{item.fileName}</p>
                <button 
                  onClick={() => downloadResult(item.image, item.fileName)}
                  style={{ background: '#E50914', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '10px', width: '100%', fontWeight: 'bold' }}
                >
                  DOWNLOAD DATA
                </button>
              </div>
            ))
          }
        </div>
      </div>

      {/* 🏛️ Main Content Area */}
      <div style={{ flex: 1, padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800', color: '#1a1a1a' }}>Vesuvius Challenge <span style={{ color: '#E50914' }}>2.0</span></h1>
            <p style={{ color: '#666', margin: '5px 0' }}>Lead Researcher: <span style={{ color: '#E50914', fontWeight: '600' }}>{username}</span></p>
          </div>
          <button onClick={() => window.location.reload()} style={{ background: '#fff', color: '#333', border: '1px solid #ccc', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>END SESSION</button>
        </header>

        {/* 📸 Action Hub */}
        <div style={{ background: '#ffffff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', marginBottom: '40px', border: '1px solid #e1e8ed' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
            
            {/*  'Add Photo' */}
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '12px 25px', 
              backgroundColor: '#333', 
              color: 'white', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600',
              transition: '0.3s'
            }}>
              <span>📸 SELECT IMAGE</span>
              <input type="file" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
            </label>

            <button 
              onClick={handleAnalyze} 
              disabled={loading}
              style={{ 
                backgroundColor: '#E50914', 
                color: 'white', 
                padding: '12px 30px', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.2)'
              }}
            >
              {loading ? "PROCESSING..." : "INITIATE AI SCAN"}
            </button>
          </div>
          {file && <p style={{ marginTop: '15px', color: '#555', fontSize: '14px' }}>Selected: <strong>{file.name}</strong></p>}
        </div>

        {/* 🖼️ Viewport */}
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#888', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Original Fragment</h4>
            <div style={{ border: '1px solid #d1d9e6', width: '460px', height: '460px', background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
              {file && <img src={URL.createObjectURL(file)} alt="Original" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#E50914', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Surface Result</h4>
            <div style={{ border: '1px solid #E50914', width: '460px', height: '460px', background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(229, 9, 20, 0.1)', position: 'relative' }}>
              {result ? (
                <>
                  <img src={`data:image/png;base64,${result}`} alt="Result" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <button 
                    onClick={() => downloadResult(result, file.name)}
                    style={{ position: 'absolute', bottom: '20px', right: '20px', background: '#1a1a1a', color: '#fff', padding: '10px 18px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    SAVE PNG
                  </button>
                </>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Waiting for scan...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;