import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import WhatsAppBackup from './WhatsAppBackup';

export default function Dashboard({ user, supabase }) {
  const [files, setFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .storage.from('user-files')
        .list(user.id);

      if (error) throw error;
      setFiles(data || []);

      const size = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      setTotalSize((size / (1024 * 1024)).toFixed(2));
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFileUploadSuccess = () => {
    loadFiles();
  };

  const handleDelete = async (fileName) => {
    try {
      const { error } = await supabase
        .storage.from('user-files')
        .remove([`${user.id}/${fileName}`]);

      if (error) throw error;
      loadFiles();
    } catch (err) {
      alert('Error deleting file: ' + err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e7e9 0%, #f7f0f3 50%, #e8f4f8 100%)'
    }}>
      <header style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(200,150,200,0.1)',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{
              padding: '8px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              borderRadius: '8px'
            }}>
              <span style={{fontSize: '20px'}}>☁️</span>
            </div>
            <div>
              <h1 style={{
                fontWeight: 'bold',
                fontSize: '18px',
                background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                MemoryVault
              </h1>
              <p style={{fontSize: '12px', color: '#999', margin: 0}}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 16px',
              background: 'rgba(239,68,68,0.1)',
              color: '#dc2626',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 16px'}}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid rgba(200,150,200,0.2)'
          }}>
            <p style={{color: '#999', fontSize: '14px', margin: '0 0 8px 0'}}>Total Files</p>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: '#a855f7', margin: 0}}>{files.length}</p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid rgba(200,150,200,0.2)'
          }}>
            <p style={{color: '#999', fontSize: '14px', margin: '0 0 8px 0'}}>Storage Used</p>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: '#ec4899', margin: 0}}>{totalSize} MB</p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid rgba(200,150,200,0.2)'
          }}>
            <p style={{color: '#999', fontSize: '14px', margin: '0 0 8px 0'}}>Available</p>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', margin: 0}}>1000+ MB</p>
          </div>
        </div>

        <div style={{marginBottom: '32px'}}>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '12px 24px',
              marginRight: '12px',
              background: activeTab === 'upload' ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' : 'white',
              color: activeTab === 'upload' ? 'white' : '#999',
              border: '1px solid #e0c7f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            📤 Upload Files
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'whatsapp' ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' : 'white',
              color: activeTab === 'whatsapp' ? 'white' : '#999',
              border: '1px solid #e0c7f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            💬 WhatsApp Backup
          </button>
        </div>

        {activeTab === 'upload' && (
          <FileUpload user={user} supabase={supabase} onSuccess={handleFileUploadSuccess} />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppBackup user={user} supabase={supabase} onSuccess={handleFileUploadSuccess} />
        )}

        {files.length > 0 && (
          <div style={{marginTop: '40px'}}>
            <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>Your Files</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {files.map((file) => (
                <div
                  key={file.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(200,150,200,0.2)',
                    transition: 'all 0.3s'
                  }}
                >
                  <p style={{fontWeight: '600', color: '#333', margin: '0 0 12px 0', wordBreak: 'break-word'}}>{file.name}</p>
                  <p style={{fontSize: '12px', color: '#999', margin: '0 0 12px 0'}}>
                    {file.metadata?.size ? `${(file.metadata.size / (1024 * 1024)).toFixed(2)} MB` : 'Size unknown'}
                  </p>
                  <button
                    onClick={() => handleDelete(file.name)}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(239,68,68,0.1)',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length === 0 && !loading && (
          <div style={{textAlign: 'center', paddingTop: '64px'}}>
            <span style={{fontSize: '64px', display: 'block', marginBottom: '16px', opacity: '0.3'}}>📁</span>
            <p style={{color: '#999', fontSize: '18px'}}>No files yet. Start uploading to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
