import React from 'react';

const whatsappNumber = '+2348066558355';
const whatsappMessage = encodeURIComponent('Hello! I would like to inquire about Atlangrove Homes.');
const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}/?text=${whatsappMessage}`;

const WhatsAppButton = () => (
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-colors"
    aria-label="Chat with us on WhatsApp"
    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12.032 2C6.495 2 2 6.495 2 12.032c0 2.145.71 4.138 1.903 5.742L2 22l4.337-1.855A9.967 9.967 0 0012.032 22c5.537 0 10.032-4.495 10.032-10.032S17.569 2 12.032 2zm0 18.885a8.842 8.842 0 01-4.503-1.258l-.327-.196-2.689 1.15.729-2.634-.21-.341a8.835 8.835 0 01-1.36-4.734c0-4.88 3.978-8.858 8.858-8.858s8.858 3.978 8.858 8.858-3.979 8.858-8.858 8.858z"/>
      <path d="M18.79 14.077c-.239-.12-1.414-.698-1.633-.777-.219-.079-.378-.12-.537.12-.159.24-.617.777-.757.937-.14.16-.279.18-.518.06-.239-.12-1.009-.372-1.922-1.189-.71-.637-1.19-1.422-1.329-1.662-.14-.24-.015-.37.105-.49.106-.107.239-.279.359-.419.12-.14.159-.24.239-.399.08-.159.04-.299-.02-.419-.06-.12-.54-1.297-.74-1.777-.196-.48-.394-.42-.538-.429-.14-.009-.34-.009-.52-.009-.18 0-.48.06-.72.359-.24.299-.92.979-.92 2.388 0 1.409.99 2.767 1.128 2.958.139.19 1.656 2.636 4.106 3.628 2.443.99 2.443.66 2.887.619.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  </a>
);

export default WhatsAppButton;
