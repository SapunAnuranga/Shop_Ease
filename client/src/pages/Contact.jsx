import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      {submitted ? (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
          Thank you for your message! We'll get back to you soon.
        </div>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3" 
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition w-full"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;