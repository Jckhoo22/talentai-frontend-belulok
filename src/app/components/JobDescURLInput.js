'use client';

import { useState } from 'react';
import axios from 'axios';
import Button from './Button';

export default function JobDescURLInput({ onExtract }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchJD = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobdesc-from-url`, { url });
      if (res.data.error) {
        alert(res.data.error);
      } else {
        onExtract(res.data.jobdesc_text);
      }
    } catch (error) {
      alert('Failed to fetch JD from URL.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Job Description URL
      </label>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste job description URL here..."
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <Button onClick={fetchJD} loading={loading} disabled={!url}>
          Fetch
        </Button>
      </div>
    </div>
  );
}
