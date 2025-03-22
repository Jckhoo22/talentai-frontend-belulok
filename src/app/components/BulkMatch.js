'use client';

import {useState} from 'react';
import axios from 'axios';
import Button from './Button';
import TextArea from './TextArea';
import PdfUploader from './PdfUploader';
import JobDescURLInput from "@/app/components/JobDescURLInput"; // Assuming this is available

export default function BulkMatch() {
    const [scenario, setScenario] = useState('pairs');
    const [inputs, setInputs] = useState([{resume: '', job_description: ''}]);
    const [singleJD, setSingleJD] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (index, field, value) => {
        const newInputs = [...inputs];
        newInputs[index][field] = value;
        setInputs(newInputs);
    };

    const addPair = () => {
        setInputs([...inputs, {resume: '', job_description: ''}]);
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
                ? {pairs: inputs}
                : {job_description: singleJD, resumes: inputs.map((i) => i.resume)};

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, payload);
            console.log("Raw API response:", res.data.bulk_analyses);

            // Extract and log percentages
            const percentages = res.data.bulk_analyses.map((analysis, idx) => ({
                index: idx,
                percentage: extractPercentage(analysis),
                text: analysis.split('\n')[0], // First line for reference
            }));
            console.log("Extracted percentages:", percentages);

            // Sorting logic b to a descending
            const sortedResults = [...res.data.bulk_analyses].sort((a, b) => {
                const percentA = extractPercentage(a);
                const percentB = extractPercentage(b);
                console.log(`Comparing: ${percentA}% (a) vs ${percentB}% (b) = ${percentB - percentA}`);
                return percentB - percentA;
            });
            console.log("Sorted results:", sortedResults);

            setResults(sortedResults);
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
                <>
                    <PdfUploader
                        label="Upload Job Description (PDF)"
                        endpoint="upload-jobdesc"
                        onExtract={(data) => setSingleJD(data.jobdesc_text)}
                        className="mb-6"
                    />
                    <JobDescURLInput onExtract={(text) => setSingleJD(text)} className="mb-6"/>
                    <TextArea
                        label="Single Job Description (JD)"
                        value={singleJD}
                        onChange={(e) => setSingleJD(e.target.value)}
                        placeholder="Paste single JD here"
                        className="mb-6"
                    />
                </>
            )}

            {inputs.map((input, index) => (
                <div key={index} className="mb-4 border p-4 rounded-lg">
                    <PdfUploader
                        label={`Upload Resume #${index + 1} (PDF)`}
                        endpoint="upload-resume"
                        onExtract={(data) => handleChange(index, 'resume', data.resume_text)}
                    />
                    <TextArea
                        label={`Resume #${index + 1}`}
                        value={input.resume}
                        onChange={(e) => handleChange(index, 'resume', e.target.value)}
                        placeholder="Paste resume here"
                    />

                    {scenario === 'pairs' && (
                        <>
                            <PdfUploader
                                label={`Upload Job Description #${index + 1} (PDF)`}
                                endpoint="upload-jobdesc"
                                onExtract={(data) => handleChange(index, 'job_description', data.jobdesc_text)}
                            />
                            <JobDescURLInput onExtract={(text) => handleChange(index, 'job_description', text)}/>
                            <TextArea
                                label={`Job Description #${index + 1}`}
                                value={input.job_description}
                                onChange={(e) => handleChange(index, 'job_description', e.target.value)}
                                placeholder="Paste job description here"
                            />
                        </>
                    )}
                    {index > 0 && (
                        <button onClick={() => removePair(index)} className="text-sm text-red-500 mt-2">
                            Remove
                        </button>
                    )}
                </div>
            ))}

            <Button onClick={addPair} className="mb-6">➕ Add More</Button>
            <Button onClick={performBulkMatch} loading={loading}>🔍 Perform Bulk Match</Button>

            {results.length > 0 && (
                <div className="mt-8 space-y-4">
                    {results.map((analysis, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl border p-4">
                            <h4 className="font-semibold text-lg mb-2">Result #{idx + 1}</h4>
                            <div className="prose prose-gray max-w-none">
                                {analysis.split('\n').map((line, lineIdx) => {
                                    if (line.includes('Match Percentage')) {
                                        return <p key={lineIdx} className="text-xl font-bold text-blue-600">{line}</p>;
                                    } else if (line.includes('Matched Skills')) {
                                        return <p key={lineIdx} className="text-green-600 font-semibold">{line}</p>;
                                    } else if (line.includes('Missing Skills')) {
                                        return <p key={lineIdx} className="text-red-600 font-semibold">{line}</p>;
                                    }
                                    return <p key={lineIdx}>{line}</p>;
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}