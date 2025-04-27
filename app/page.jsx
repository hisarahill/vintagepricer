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
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-6">Vintage Pricing Assistant</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} required className="border p-2" />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="border p-2" />
        <input name="materials" placeholder="Materials" value={formData.materials} onChange={handleChange} className="border p-2" />
        <input name="condition" placeholder="Condition" value={formData.condition} onChange={handleChange} required className="border p-2" />
        <input name="dimensions" placeholder="Dimensions" value={formData.dimensions} onChange={handleChange} className="border p-2" />
        <button type="submit" className="bg-black text-white p-2">{loading ? 'Generating...' : 'Generate Listing'}</button>
      </form>

      {result && (
        <div className="mt-8 p-4 border w-full max-w-md">
          <h2 className="text-xl mb-2">AI Generated Output:</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </main>
  );
}
