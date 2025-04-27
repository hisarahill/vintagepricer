'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    materials: '',
    condition: '',
    dimensions: '',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#FDF6EC]">
      <h1 className="text-4xl font-bold mb-8 text-[#5E4B3C] text-center">Vintage Listing Generator</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <input
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
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

      {result && (
        <div className="mt-10 p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4 text-center text-[#5E4B3C]">Generated Listing</h2>
          <pre className="whitespace-pre-wrap text-gray-700">{result}</pre>
        </div>
      )}
    </main>
  );
}
