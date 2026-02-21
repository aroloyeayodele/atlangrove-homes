import React from 'react';

const whatsappNumber = '+2348137990792';
const whatsappMessage = encodeURIComponent('Hello! I would like to inquire about Atlangrove Heights.');
const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+','')}/?text=${whatsappMessage}`;

const WhatsAppButton = () => (
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-colors"
    aria-label="Chat with us on WhatsApp"
    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
  >
    {/* Message icon (can be replaced with a customer care icon if preferred) */}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </a>
);

export default WhatsAppButton;
