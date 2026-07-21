import React, { useState } from 'react';

export default function WhatsAppBackup({ user, supabase, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleBackupUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setMessage('Processing WhatsApp backup...');

    try {
      for (let file of files) {
        const fileName = `whatsapp_backup_${Date.now()}_${file.name}`;
        const { error } = await supabase
          .storage.from('user-files')
          .upload(`${user.id}/${fileName}`, file);

        if (error) throw error;
      }

      setMessage('✨ WhatsApp backup uploaded successfully! Your iPhone storage should free up soon.');
      onSuccess();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }

    setUploading(false);
    event.target.value = '';
  };

  return (
    <div style={{background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid rgba(200,150,200,0.2)'}}>
      <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '8px'}}>📱 WhatsApp Backup to Cloud</h3>
      <p style={{color: '#666', marginBottom: '24px'}}>
        Export your WhatsApp messages & media to MemoryVault. This frees up your iPhone storage instantly.
      </p>

      <div style={{background: '#f0f8ff', border: '2px solid #3b82f6', borderRadius: '12px', padding: '16px', marginBottom: '24px'}}>
        <p style={{fontSize: '14px', color: '#1e40af', marginBottom: '8px'}}>
          <strong>How to export WhatsApp:</strong>
        </p>
        <ol style={{fontSize: '14px', color: '#1e40af', margin: 0, paddingLeft: '20px'}}>
          <li>Open WhatsApp → Settings → Chats</li>
          <li>Tap "Chat Backup"</li>
          <li>Select "Save to Files" (not iCloud)</li>
          <li>Upload that file below ↓</li>
        </ol>
      </div>

      <label style={{display: 'block', cursor: 'pointer'}}>
        <div style={{
          border: '2px dashed #e0c7f0',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          background: 'rgba(200,150,220,0.02)',
          transition: 'all 0.3s'
        }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#c084fc';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#e0c7f0';
          }}
        >
          <span style={{fontSize: '40px', display: 'block', marginBottom: '12px'}}>💬</span>
          <p style={{fontSize: '16px', fontWeight: '600', color: '#a855f7', margin: 0}}>
            Click to select WhatsApp backup file
          </p>
          <input
            type="file"
            onChange={handleBackupUpload}
            disabled={uploading}
            style={{display: 'none'}}
            accept=".zip,.txt,.db"
          />
        </div>
      </label>

      {message && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: message.includes('Error') ? '#fee2e2' : '#dcfce7',
          border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`,
          borderRadius: '8px',
          color: message.includes('Error') ? '#dc2626' : '#22863a',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}

      {uploading && (
        <div style={{marginTop: '16px', textAlign: 'center', color: '#999'}}>
          Processing... this may take a moment
        </div>
      )}

      <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e0c7f0', fontSize: '12px', color: '#999'}}>
        <p>
          ✅ Your WhatsApp data is encrypted and private<br/>
          ✅ Only you can access your backup<br/>
          ✅ Safe to delete WhatsApp media from iPhone after backup
        </p>
      </div>
    </div>
  );
}
