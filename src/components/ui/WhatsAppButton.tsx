import React from 'react';

const whatsappNumber = '+2348061720146';
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
    {/* WhatsApp Official Icon */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.932 1.223l-.348.203-3.607-.94 1.012 3.457-.236.389c-1.265 2.062-1.96 4.497-1.96 7.041 0 5.502 4.478 9.98 9.98 9.98 2.673 0 5.193-.836 7.347-2.417l.385-.252 3.619.947-1.007-3.498.242-.386c1.27-2.068 1.97-4.507 1.97-7.043 0-5.502-4.478-9.98-9.98-9.98m0-2C12.331 4 6.5 9.831 6.5 17a10 10 0 001.714 5.664L6.5 24l5.569-1.812A10 10 0 0017.5 17c0-7.169-5.831-13-13-13z" />
    </svg>
  </a>
);

export default WhatsAppButton;
