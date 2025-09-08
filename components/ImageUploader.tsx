import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons';
import { TEXTS } from '../constants';
import { Language } from '../types';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  language: Language;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, language }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       onImageUpload(file);
    }
  }, [onImageUpload]);


  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transition-all duration-300 ${isDragging ? 'ring-2 ring-green-500 scale-105' : 'ring-1 ring-gray-200 dark:ring-gray-700'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 hover:border-green-500 dark:hover:border-green-400 transition-colors cursor-pointer flex flex-col items-center justify-center"
          onClick={handleButtonClick}
        >
          <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
            <UploadIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-800 dark:text-gray-100">{TEXTS[language].uploadTitle}</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-xs">{TEXTS[language].uploadSubtitle}</p>
          <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">or drag and drop</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 dark:focus:ring-offset-gray-800"
        >
          {TEXTS[language].uploadButton}
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;