import { useState, useRef } from 'react';

const ImageUpload = ({ 
  label, 
  onChange, 
  currentImage = null,
  error = null,
  className = '',
  maxSizeMB = 2 
}) => {
  const [preview, setPreview] = useState(
    currentImage instanceof File 
      ? URL.createObjectURL(currentImage) 
      : currentImage 
        ? (typeof currentImage === 'string' ? currentImage : URL.createObjectURL(currentImage))
        : null
  );
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFile = (file) => {
    // Reset local error
    setLocalError(null);
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setLocalError('Le fichier doit être une image (jpg, png, gif)');
      return;
    }
    
    // Validate file size (max 2MB by default)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`L'image ne doit pas dépasser ${maxSizeMB}MB`);
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Call parent onChange
    onChange(file);
  };
  
  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange(null);
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={!preview ? handleClick : undefined}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full">
            <img 
              src={preview} 
              alt="Aperçu" 
              className="mx-auto max-h-64 object-contain rounded"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-center mt-4">
              <p className="text-sm font-medium text-blue-600">
                Cliquez ou glissez une image ici
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF jusqu'à {maxSizeMB}MB
              </p>
            </div>
          </>
        )}
      </div>
      
      {(error || localError) && (
        <p className="mt-1 text-sm text-red-600">
          {error || localError}
        </p>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
    </div>
  );
};

export default ImageUpload;