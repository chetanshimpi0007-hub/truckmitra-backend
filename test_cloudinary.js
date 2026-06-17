async function testCloudinary() {
  try {
    const cloudName = 'dmtrmiad3';
    const uploadPreset = 'truckmitra_preset';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    const DUMMY_IMAGE = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    
    const formData = new FormData();
    formData.append('file', new Blob([DUMMY_IMAGE], { type: 'image/gif' }), 'dummy.gif');
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'truckmitra');
    
    console.log('Sending to Cloudinary:', url);
    const res = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    if (res.ok) {
      console.log('Cloudinary Success:', data.secure_url);
    } else {
      console.log('Cloudinary Error:', data);
    }
  } catch (e) {
    console.error('Cloudinary Exception:', e.message);
  }
}

testCloudinary();
