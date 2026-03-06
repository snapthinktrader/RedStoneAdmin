/**
 * Chunked File Upload Utility
 * Uploads large files in chunks to avoid serverless timeout
 */

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://redstonebackend.onrender.com/api';
const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks

/**
 * Upload file in chunks
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<{fileId: string, downloadUrl: string, fileSize: string}>}
 */
export async function uploadFileInChunks(file, onProgress) {
  try {
    // Calculate total chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    console.log(`📦 Uploading ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB) in ${totalChunks} chunks`);
    
    // Step 1: Initialize upload session
    const initResponse = await fetch(`${API_BASE}/chunked-upload/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        totalChunks: totalChunks,
        fileSize: file.size
      })
    });
    
    if (!initResponse.ok) {
      throw new Error(`Failed to initialize upload: ${initResponse.statusText}`);
    }
    
    const { uploadId } = await initResponse.json();
    console.log(`✅ Upload session initialized: ${uploadId}`);
    
    // Step 2: Upload chunks
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      const formData = new FormData();
      formData.append('chunk', chunk);
      
      const chunkResponse = await fetch(
        `${API_BASE}/chunked-upload/${uploadId}/${chunkIndex}`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (!chunkResponse.ok) {
        throw new Error(`Failed to upload chunk ${chunkIndex}: ${chunkResponse.statusText}`);
      }
      
      const chunkResult = await chunkResponse.json();
      
      // Update progress
      if (onProgress) {
        onProgress(chunkResult.progress);
      }
      
      console.log(`✅ Chunk ${chunkIndex + 1}/${totalChunks} uploaded (${chunkResult.progress}%)`);
    }
    
    // Step 3: Finalize upload
    console.log('🔄 Finalizing upload...');
    
    const finalizeResponse = await fetch(
      `${API_BASE}/chunked-upload/finalize/${uploadId}`,
      {
        method: 'POST'
      }
    );
    
    if (!finalizeResponse.ok) {
      throw new Error(`Failed to finalize upload: ${finalizeResponse.statusText}`);
    }
    
    const result = await finalizeResponse.json();
    
    console.log('✅ Upload complete!', result);
    
    return {
      fileId: result.fileId,
      downloadUrl: `${API_BASE.replace('/api', '')}${result.downloadUrl}`,
      fileSize: result.fileSize,
      filename: result.filename
    };
    
  } catch (error) {
    console.error('❌ Chunked upload error:', error);
    throw error;
  }
}

/**
 * Cancel an ongoing upload
 * @param {string} uploadId - The upload session ID
 */
export async function cancelUpload(uploadId) {
  try {
    await fetch(`${API_BASE}/chunked-upload/${uploadId}`, {
      method: 'DELETE'
    });
    console.log(`❌ Upload cancelled: ${uploadId}`);
  } catch (error) {
    console.error('Error cancelling upload:', error);
  }
}