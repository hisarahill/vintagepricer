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
    <div className="min-h-screen bg-[#FDF6EC] relative overflow-hidden">

      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-repeat opacity-30"
        style={{
          backgroundImage: "url('/headerbackground.png')",
          backgroundSize: '300px',
        }}
      />

      {/* Floating Bunnies */}
      <img
        src="/bunnyleft.png"
        alt="Left Bunny"
        className="absolute left-0 top-20 md:top-24 w-24 md:w-32 animate-float"
      />
      <img
        src="/bunnyright.png"
        alt="Right Bunny"
        className="absolute right-0 top-20 md:top-24 w-24 md:w-32 animate-float-reverse"
      />

      {/* Header */}
      <div className="flex justify-center pt-8 z-10 relative">
        <img
          src="/header.png"
          alt="Vintage Reseller Pricing Tool"
          className="max-w-md md:max-w-lg lg:max-w-xl"
        />
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-6 pt-16 md:pt-24 z-10 relative">
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

          {/* Result Section */}
          {(price || title || keywords || description) && (
            <div className="flex flex-col w-full md:w-1/2 bg-white p-8 rounded-xl shadow-lg gap-6">
              <h2 className="text-2xl font-semibold text-center text-[#5E4B3C] mb-2">Generated Listing</h2>

              {/* Price */}
              <div>
                <label className="block text-sm font-bold mb-2">Price</label>
                <div className="flex gap-2">
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex-1 border rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
                  />
                  <button
                    onClick={() => handleCopy(price)}
                    type="button"
                    className="bg-[#D87D4A] hover:bg-[#c26c40] text-white font-semibold px-4 py-2 rounded-md transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold mb-2">Title</label>
                <div className="flex gap-2">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 border rounded-md p-3 bg-[#f9f5f0] focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
                  />
                  <button
                    onClick={() => handleCopy(title)}
                    type="button"
                    className="bg-[#D87D4A] hover:bg-[#c26c40] text-white font-semibold px-4 py-2 rounded-md transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-bold mb-2">Keywords</label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="flex-1 border rounded-md p-3 bg-[#f9f5f0] resize-none focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
                  />
                  <button
                    onClick={() => handleCopy(keywords)}
                    type="button"
                    className="bg-[#D87D4A] hover:bg-[#c26c40] text-white font-semibold px-4 py-2 rounded-md transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <div className="flex gap-2">
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex-1 border rounded-md p-3 bg-[#f9f5f0] resize-none focus:outline-none focus:ring-2 focus:ring-[#D87D4A]"
                  />
                  <button
                    onClick={() => handleCopy(description)}
                    type="button"
                    className="bg-[#D87D4A] hover:bg-[#c26c40] text-white font-semibold px-4 py-2 rounded-md transition"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Float Animation Keyframes */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        @keyframes float-reverse {
          0% { transform: translateY(0); }
          50% { transform: translateY(8px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
