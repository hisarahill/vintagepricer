'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    materials: '',
    condition: '',
    dimensions: '',
    similarLink: '',
  });

  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
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

    const sections = {
      Price: '',
      Title: '',
      Keywords: '',
      Description: '',
    };

    data.result.split('\n').forEach((line) => {
      if (line.startsWith('Price:')) sections.Price = line.replace('Price:', '').trim();
      else if (line.startsWith('Title:')) sections.Title = line.replace('Title:', '').trim();
      else if (line.startsWith('Keywords:')) sections.Keywords = line.replace('Keywords:', '').trim();
      else if (line.startsWith('Description:')) sections.Description = line.replace('Description:', '').trim();
    });

    setPrice(sections.Price);
    setTitle(sections.Title);
    setKeywords(sections.Keywords);
    setDescription(sections.Description);
    setLoading(false);
  };

  const handleCopy = async (text) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <>
      <header className="relative w-full h-48">
  {/* Background pattern */}
  <img
    src="/headerbackground.png"
    alt="Background Pattern"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Foreground: bunnies + text */}
  <div className="relative flex justify-center items-center h-full">
    <img
      src="/header.png"
      alt="Vintage Reseller Pricing Tool Banner"
      className="max-h-32 object-contain"
    />
  </div>
</header>


      <main className="flex flex-col items-center justify-center min-h-screen p-6 pt-40 bg-[#FDF6EC] font-poppins">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full md:w-1/2 bg-white p-8 rounded-xl shadow-md">
            <input name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} required className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]" />
            <input name="materials" placeholder="Materials" value={formData.materials} onChange={handleChange} className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]" />
            <input name="condition" placeholder="Condition" value={formData.condition} onChange={handleChange} required className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]" />
            <input name="dimensions" placeholder="Dimensions" value={formData.dimensions} onChange={handleChange} className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]" />
            <input name="similarLink" placeholder="Similar Item Link (optional)" value={formData.similarLink} onChange={handleChange} className="border border-gray-300 rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]" />
            <button type="submit" className="bg-[#D87D4A] hover:bg-[#c26c40] text-white font-semibold py-3 px-6 rounded-md transition duration-300">
              {loading ? 'Generating...' : 'Generate Listing'}
            </button>
          </form>

          {/* Result Section */}
          {(price || title || keywords || description) && (
            <div className="flex flex-col w-full md:w-1/2 bg-white p-8 rounded-xl shadow-lg gap-6">
              <h2 className="text-2xl font-semibold text-center text-[#5E4B3C] mb-2">Generated Listing</h2>
              {['Price', 'Title', 'Keywords', 'Description'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-bold mb-2">{field}</label>
                  <div className="flex gap-2">
                    {field === 'Keywords' || field === 'Description' ? (
                      <textarea rows={field === 'Keywords' ? 2 : 4} value={eval(field.toLowerCase())} onChange={(e) => eval(`set${field}`)(e.target.value)} className="flex-1 border rounded-md p-3 bg-[#f9f5f0] resize-none focus:outline-none focus:ring-2 focus:ring-[#D87D4A]" />
                    ) : (
                      <input value={eval(field.toLowerCase())} onChange={(e) => eval(`set${field}`)(e.target.value)} className="flex-1 border rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]" />
                    )}
                    <button onClick={() => handleCopy(eval(field.toLowerCase()))} type="button" className="bg-[#D87D4A] hover:bg-[#c26c40] text-white font-semibold px-4 py-2 rounded-md transition">
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
