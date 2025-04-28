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
      {/* Header image */}
   <header className="w-full flex justify-center bg-[#f9f5f0] shadow-md p-4 sticky top-0 z-50">
  <img
    src="/header.png"
    alt="Vintage Reseller Pricing Tool Banner"
    className="w-[70%] max-w-4xl rounded-xl shadow-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(216,125,74,0.4)] transition-all duration-300 object-contain"
  />
</header>



      {/* Main content */}
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#FDF6EC] font-poppins">
        {/* All your form and results (exactly as you wrote) */}
        ...
      </main>
    </>
  );
}
