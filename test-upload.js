import fs from 'fs';

async function testUpload() {
  const formData = new FormData();
  
  // Create a fake avif file
  const avifData = new Uint8Array([0,0,0,0,0x66,0x74,0x79,0x70,0x61,0x76,0x69,0x66]); // 'ftypavif' header
  const file = new File([avifData], 'test.avif', { type: 'image/avif' });
  
  formData.append('file', file);
  
  try {
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });
    
    console.log('Status:', res.status);
    console.log('Body:', await res.text());
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testUpload();
