import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Edit2, CheckCircle, XCircle, Plus } from 'lucide-react';
import { uploadFileInChunks } from '../utils/chunkedUpload';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const AppVersionManagement = () => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    version: '',
    versionCode: '',
    platform: 'android',
    downloadUrl: '',
    fileSize: '',
    releaseNotes: '',
    features: [''],
    bugFixes: [''],
    isMandatory: false,
    minSupportedVersion: '',
  });

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/apk-management/versions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setVersions(Array.isArray(data.data) ? data.data : []);
      } else {
        setVersions([]);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      setVersions([]);
      alert('Failed to fetch versions');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['.apk', '.ipa'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExt)) {
        alert('Please select a valid APK or IPA file');
        e.target.value = '';
        return;
      }

      // Validate file size (500MB max)
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 500MB');
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
      
      // Auto-fill file size
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setFormData({ ...formData, fileSize: `${fileSizeInMB} MB` });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    let downloadUrl = formData.downloadUrl;
    let fileId = null;
    let filename = null;
    let fileSize = formData.fileSize;

    // If file is selected, upload it first
    if (selectedFile) {
      console.log('🚀 Starting file upload...');
      setUploadingFile(true);
      setUploadProgress(0);

      try {
        // Use chunked upload for large files
        const result = await uploadFileInChunks(selectedFile, (progress) => {
          console.log(`📊 Upload progress callback: ${progress}%`);
          setUploadProgress(progress);
        });
        
        console.log('Upload successful:', result);
        
        // Extract file info from upload result
        downloadUrl = result.downloadUrl;
        fileId = result.fileId;
        filename = result.filename;
        fileSize = result.fileSize;
        
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Failed to upload file: ${error.message}`);
        setUploadingFile(false);
        setUploadProgress(0);
        return;
      } finally {
        setUploadingFile(false);
        setUploadProgress(0);
      }
    }

    // Validate download URL
    if (!downloadUrl || downloadUrl.trim() === '') {
      alert('Please provide a download URL or upload a file');
      return;
    }

    // Clean up empty features and bug fixes
    const cleanedData = {
      version: formData.version,
      versionCode: parseInt(formData.versionCode),
      fileId: fileId,
      filename: filename || selectedFile?.name || 'unknown',
      fileSize: fileSize,
      downloadUrl: downloadUrl,
      releaseNotes: formData.releaseNotes,
      features: formData.features.filter(f => f.trim() !== ''),
      bugFixes: formData.bugFixes.filter(b => b.trim() !== ''),
      isActive: formData.isMandatory, // Use isMandatory as isActive for now
      platform: formData.platform,
      minOsVersion: formData.minSupportedVersion || '5.0',
      uploadedBy: 'admin', // TODO: Get from auth context
    };

    try {
      const url = selectedVersion 
        ? `${API_BASE}/apk-management/version/${selectedVersion._id}`
        : `${API_BASE}/apk-management/version`;
      
      const method = selectedVersion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(selectedVersion ? 'Version updated successfully!' : 'Version created successfully!');
        setShowAddModal(false);
        resetForm();
        fetchVersions();
      } else {
        alert(data.message || 'Failed to save version');
      }
    } catch (error) {
      console.error('Error saving version:', error);
      alert('Failed to save version');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this version? This will also delete the APK file from storage.')) return;

    try {
      const response = await fetch(`${API_BASE}/apk-management/version/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Version and APK file deleted successfully!');
        fetchVersions();
      } else {
        alert(data.message || 'Failed to delete version');
      }
    } catch (error) {
      console.error('Error deleting version:', error);
      alert('Failed to delete version');
    }
  };

  const handleEdit = (version) => {
    setSelectedVersion(version);
    setFormData({
      version: version.version,
      versionCode: version.versionCode.toString(),
      platform: version.platform,
      downloadUrl: version.downloadUrl,
      fileSize: version.fileSize,
      releaseNotes: version.releaseNotes,
      features: version.features.length > 0 ? version.features : [''],
      bugFixes: version.bugFixes.length > 0 ? version.bugFixes : [''],
      isMandatory: version.isMandatory,
      minSupportedVersion: version.minSupportedVersion || '',
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      version: '',
      versionCode: '',
      platform: 'android',
      downloadUrl: '',
      fileSize: '',
      releaseNotes: '',
      features: [''],
      bugFixes: [''],
      isMandatory: false,
      minSupportedVersion: '',
    });
    setSelectedVersion(null);
    setSelectedFile(null);
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addBugFix = () => {
    setFormData({ ...formData, bugFixes: [...formData.bugFixes, ''] });
  };

  const removeBugFix = (index) => {
    const newBugFixes = formData.bugFixes.filter((_, i) => i !== index);
    setFormData({ ...formData, bugFixes: newBugFixes });
  };

  const updateBugFix = (index, value) => {
    const newBugFixes = [...formData.bugFixes];
    newBugFixes[index] = value;
    setFormData({ ...formData, bugFixes: newBugFixes });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading versions...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">App Version Management</h1>
          <p className="text-gray-600 mt-1">Manage APK uploads and app versions</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Version
        </button>
      </div>

      {/* Versions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {versions && versions.length > 0 ? (
                versions.map((version) => (
                <tr key={version._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">v{version.version}</div>
                    <div className="text-sm text-gray-500">Code: {version.versionCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      version.platform === 'android' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {version.platform.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{version.fileSize}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {version.downloadCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {version.isActive ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-400">
                        <XCircle className="w-4 h-4 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(version.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(version)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(version._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium mb-2">No APK versions found</p>
                      <p className="text-sm">Upload your first APK to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedVersion ? 'Edit Version' : 'Add New Version'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 1.0.0"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version Code</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g., 1"
                      value={formData.versionCode}
                      onChange={(e) => setFormData({ ...formData, versionCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="android">Android</option>
                      <option value="ios">iOS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 45.2 MB"
                      value={formData.fileSize}
                      onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      readOnly={selectedFile !== null}
                    />
                    {selectedFile && (
                      <p className="text-xs text-green-600 mt-1">Auto-filled from uploaded file</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">APK/IPA File Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="flex flex-col items-center">
                        <label htmlFor="apk-upload" className="cursor-pointer">
                          <span className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 inline-block">
                            Choose File
                          </span>
                          <input
                            id="apk-upload"
                            type="file"
                            accept=".apk,.ipa"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploadingFile}
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                          {selectedFile ? selectedFile.name : 'APK or IPA file (Max 500MB)'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Upload Progress Bar - Always visible when uploading */}
                  {uploadingFile && (
                    <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-blue-900">
                          📦 Uploading {selectedFile?.name}
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        >
                          <div className="h-full w-full bg-white opacity-30 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs font-medium text-blue-700">
                          {uploadProgress < 100 ? (
                            <>🔄 Uploading chunks... Please wait</>
                          ) : (
                            <>✨ Finalizing upload...</>
                          )}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Upload your APK/IPA file directly, or provide a download URL below
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Download URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={selectedFile !== null}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedFile ? 'File selected - URL field disabled' : 'Or paste an external download link'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Release Notes</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="What's new in this version..."
                    value={formData.releaseNotes}
                    onChange={(e) => setFormData({ ...formData, releaseNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="New feature..."
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    + Add Feature
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bug Fixes</label>
                  {formData.bugFixes.map((bugFix, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Bug fix..."
                        value={bugFix}
                        onChange={(e) => updateBugFix(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      {formData.bugFixes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBugFix(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBugFix}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    + Add Bug Fix
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isMandatory"
                    checked={formData.isMandatory}
                    onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isMandatory" className="text-sm font-medium text-gray-700">
                    Mandatory Update
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={uploadingFile}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingFile}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {uploadingFile ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      selectedVersion ? 'Update Version' : 'Create Version'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppVersionManagement;