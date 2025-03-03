'use client';

import { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import TextArea from './TextArea';

export default function BulkMatch() {
  const [scenario, setScenario] = useState('pairs');
  const [inputs, setInputs] = useState([{ resume: '', job_description: '' }]);
  const [singleJD, setSingleJD] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addPair = () => {
    setInputs([...inputs, { resume: '', job_description: '' }]);
  };

  const removePair = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  const performBulkMatch = async () => {
    setLoading(true);
    setResults([]);

    const endpoint = scenario === 'pairs' ? '/bulk-match-pairs' : '/bulk-match-one-jd';
    const payload =
      scenario === 'pairs'
        ? { pairs: inputs }
        : { job_description: singleJD, resumes: inputs.map((i) => i.resume) };

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, payload);
      setResults(res.data.bulk_analyses);
    } catch (error) {
      console.error(error);
      alert('Bulk analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 my-12">
      <h2 className="text-xl font-semibold mb-4">Bulk Resume Matching 🚀</h2>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setScenario('pairs')}
          className={`px-4 py-2 rounded ${scenario === 'pairs' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Multiple (Resume–JD pairs)
        </button>
        <button
          onClick={() => setScenario('singleJD')}
          className={`px-4 py-2 rounded ${scenario === 'singleJD' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Multiple Resumes (Single JD)
        </button>
      </div>

      {scenario === 'singleJD' && (
        <TextArea
          label="Single Job Description (JD)"
          value={singleJD}
          onChange={(e) => setSingleJD(e.target.value)}
          placeholder="Paste single JD here"
          className="mb-6"
        />
      )}

      {inputs.map((input, index) => (
        <div key={index} className="mb-4 border p-4 rounded-lg">
          <TextArea
            label={`Resume #${index + 1}`}
            value={input.resume}
            onChange={(e) => handleChange(index, 'resume', e.target.value)}
            placeholder="Paste resume here"
          />
          {scenario === 'pairs' && (
            <TextArea
              label={`Job Description #${index + 1}`}
              value={input.job_description}
              onChange={(e) => handleChange(index, 'job_description', e.target.value)}
              placeholder="Paste job description here"
            />
          )}
          <button onClick={() => removePair(index)} className="text-sm text-red-500 mt-2">
            Remove
          </button>
        </div>
      ))}

      <Button onClick={addPair} className="mb-6">➕ Add More</Button>
      <Button onClick={performBulkMatch} loading={loading}>🔍 Perform Bulk Match</Button>

      {results.length > 0 && (
        <div className="mt-8 space-y-4">
          {results.map((analysis, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl border p-4">
              <h4 className="font-semibold">Result #{idx + 1}</h4>
              <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
