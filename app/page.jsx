'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    materials: '',
    condition: '',
    dimensions: '',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResultChange = (e) => {
    setResult(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setResult(data.result);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(result);
      alert('Copied to clipboard!');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#FDF6EC] font-poppins">
      <h1 className="text-4xl font-bold mb-8 text-[#5E4B3C] text-center">Vintage Listing Generator</h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full md:w-1/2 bg-white p-8 rounded-xl shadow-md">
          <input
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
          />
          <input
            name="materials"
            placeholder="Materials"
            value={formData.materials}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
          />
          <input
            name="condition"
            placeholder="Condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
          />
          <input
            name="dimensions"
            placeholder="Dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
          />
          <button
            type="submit"
            className="bg-[#D87D4A] hover:bg-[#c26c40] text-white font-semibold py-3 px-6 rounded-md transition duration-300"
          >
            {loading ? 'Generating...' : 'Generate Listing'}
          </button>
        </form>

        {/* Result Section */}
        {result && (
          <div className="flex flex-col w-full md:w-1/2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-[#5E4B3C]">Generated Listing</h2>
            <textarea
              value={result}
              onChange={handleResultChange}
              rows={16}
              className="border border-gray-300 rounded-md p-4 bg-[#f9f5f0] text-gray-700 w-full resize-none focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
            />
            <button
              onClick={handleCopy}
              className="mt-4 bg-[#D87D4A] hover:bg-[#c26c40] text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
