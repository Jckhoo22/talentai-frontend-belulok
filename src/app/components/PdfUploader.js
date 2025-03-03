'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PdfUploader({ onExtract, label, endpoint }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onExtract(res.data);
    } catch (error) {
      console.error(error);
      alert('Error extracting PDF text.');
    }
  }, [onExtract, endpoint]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 rounded-xl cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-blue-500">Drop PDF here...</p>
        ) : (
          <p className="text-center text-gray-600">Drag & drop PDF or click to select file</p>
        )}
      </div>
    </div>
  );
}
