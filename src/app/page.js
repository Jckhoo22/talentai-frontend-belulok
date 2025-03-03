'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './components/Button';
import TextArea from './components/TextArea';
import PdfUploader from './components/PdfUploader';
import JobDescURLInput from './components/JobDescURLInput';
import BulkMatch from './components/BulkMatch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const analyzeMatch = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/match`, {
        resume,
        job_description: jobDescription,
      });
      setResult(response.data.analysis);
    } catch (error) {
      console.error(error);
      setResult('Error analyzing match.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight mb-4">
            TalentAI Resume Matcher V1
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze how well your resume matches the job description using advanced AI technology
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
          <div className="grid gap-8 mb-8">

            <PdfUploader
              label="Upload Resume (PDF)"
              endpoint="upload-resume"
              onExtract={(data) => setResume(data.resume_text)}
            />

            <TextArea
              label="Your Resume (Extracted Text)"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Or paste your resume here..."
              className="min-h-[150px]"
            />

            <PdfUploader
              label="Upload Job Description (PDF)"
              endpoint="upload-jobdesc"
              onExtract={(data) => setJobDescription(data.jobdesc_text)}
            />
            <JobDescURLInput onExtract={(text) => setJobDescription(text)} />

            <TextArea
              label="Job Description (Extracted Text)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Or paste the job description here..."
              className="min-h-[150px]"
            />

            <div className="flex justify-center">
              <Button
                onClick={analyzeMatch}
                loading={loading}
                disabled={!resume || !jobDescription}
                size="large"
                className="w-full sm:w-auto min-w-[200px]"
              >
                Analyze Match
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Result</h2>
                <div className="prose prose-gray max-w-none">
                  {result.split('\n').map((line, idx) => {
                    if (line.includes('Match Percentage')) {
                      return <p key={idx} className="text-xl font-bold text-blue-600">{line}</p>;
                    } else if (line.includes('Matched Skills')) {
                      return <p key={idx} className="text-green-600 font-semibold">{line}</p>;
                    } else if (line.includes('Missing Skills')) {
                      return <p key={idx} className="text-red-600 font-semibold">{line}</p>;
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>
              </div>
            </div>
          )}
        </div><BulkMatch />

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by advanced AI technology</p>
        </footer>
      </div>
    </div>
  );
}
