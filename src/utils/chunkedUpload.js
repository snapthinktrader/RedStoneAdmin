const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://redstonebackend.onrender.com/api';
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

export const uploadFileInChunks = async (file, onProgress) => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
  console.log(`📦 File: ${file.name}`);
  console.log(`📊 Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🔢 Total chunks: ${totalChunks}`);

  try {
    // Step 1: Initialize upload
    console.log('🚀 Step 1: Initializing upload...');
    const initResponse = await fetch(`${API_BASE}/chunked-upload/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
      body: JSON.stringify({
        filename: file.name,
        totalChunks: totalChunks,
        fileSize: file.size,
      }),
    });

    if (!initResponse.ok) {
      throw new Error('Failed to initialize upload');
    }

    const { uploadId } = await initResponse.json();
    console.log(`✅ Upload initialized with ID: ${uploadId}`);

    // Step 2: Upload chunks
    console.log('📤 Step 2: Uploading chunks...');
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);

      console.log(`📦 Uploading chunk ${chunkIndex + 1}/${totalChunks} (${(chunk.size / 1024).toFixed(2)} KB)`);

      const chunkResponse = await fetch(`${API_BASE}/chunked-upload/${uploadId}/${chunkIndex}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });

      if (!chunkResponse.ok) {
        throw new Error(`Failed to upload chunk ${chunkIndex + 1}`);
      }

      // Update progress
      const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
      console.log(`📊 Progress: ${progress}%`);
      if (onProgress) {
        onProgress(progress);
      }
    }

    // Step 3: Finalize upload
    console.log('✨ Step 3: Finalizing upload...');
    const finalizeResponse = await fetch(`${API_BASE}/chunked-upload/finalize/${uploadId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });

    if (!finalizeResponse.ok) {
      throw new Error('Failed to finalize upload');
    }

    const result = await finalizeResponse.json();
    console.log('✅ Upload completed successfully!', result);

    return {
      fileId: result.fileId,
      downloadUrl: result.downloadUrl,
      filename: result.filename,
      fileSize: result.fileSize,
    };
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};
