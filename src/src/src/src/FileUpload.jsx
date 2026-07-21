import React, { useState } from 'react';

export default function FileUpload({ user, supabase, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setMessage('');

    let successCount = 0;

    for (let file of files) {
      try {
        const fileName = `${Date.now()}_${file.name}`;
        const { error } = await supabase
          .storage.from('user-files')
          .upload(`${user.id}/${fileName}`, file);

        if (error) throw error;
        successCount++;
      } catch (err) {
        setMessage(`Error uploading ${file.name}: ${err.message}`);
      }
    }

    setMessage(`✨ ${successCount} file(s) uploaded successfully!`);
    setUploading(false);
    onSuccess();
    
    event.target.value = '';
  };

  return (
    <div>
      <label style={{display: 'block', cursor: 'pointer'}}>
        <div style={{
          border: '2px dashed #e0c7f0',
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          background: 'rgba(200,150,220,0.02)',
          transition: 'all 0.3s'
        }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#c084fc';
            e.currentTarget.style.background = 'rgba(200,150,220,0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#e0c7f0';
            e.currentTarget.style.background = 'rgba(200,150,220,0.02)';
          }}
        >
          <span style={{fontSize: '48px', display: 'block', marginBottom: '12px'}}>📤</span>
          <p style={{fontSize: '18px', fontWeight: '600', color: '#a855f7', marginBottom: '8px', margin: 0}}>
            Drop files here or click to upload
          </p>
          <p style={{fontSize: '14px', color: '#999', margin: 0}}>Photos, videos, documents, audio—anything</p>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            style={{display: 'none'}}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
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
          Uploading... please wait
        </div>
      )}
    </div>
  );
}
