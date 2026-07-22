import React, { useState } from 'react';

export default function FileUpload({ user, supabase }) {

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      setMessage('');

      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      // Fixed: changed session.user.id to user.id
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vault-files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      setMessage('File uploaded successfully!');
    } catch (error) {
      setMessage(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', background: '#222', borderRadius: '6px' }}>
      <h4>Upload to Vault</h4>
      {message && <p style={{ fontSize: '14px', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      <input
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
        style={{ color: '#fff', marginTop: '10px' }}
      />
      {uploading && <p style={{ fontSize: '12px', color: '#aaa' }}>Uploading...</p>}
    </div>
  );
}
