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
    <div className="min-h-screen bg-[#FDF6EC] font-poppins overflow-x-hidden">
      {/* Header */}
      <div className="relative w-full bg-[#f9f5f0]">
        <img
          src="/headbackground.png"
          alt="Background"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/header.png" alt="Vintage Reseller Pricing Tool" className="h-32 object-contain" />
        </div>
        <img
          src="/bunnyleft.png"
          alt="Left Bunny"
          className="absolute left-2 top-1 h-30 w-auto"
        />
        <img
          src="/bunnyright.png"
          alt="Right Bunny"
          className="absolute right-2 top-1 h-30 w-auto"
        />
      </div>

      {/* Form */}
      <main className="flex flex-col items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
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
          <input
            name="similarLink"
            placeholder="Similar Item Link (optional)"
            value={formData.similarLink}
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

        {/* Results */}
        {(price || title || keywords || description) && (
          <div className="flex flex-col w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg gap-6 mt-8">
            {/* Same results section as before */}
          </div>
        )}
      </main>
    </div>
  );
}
