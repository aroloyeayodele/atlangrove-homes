/**
 * Format a number as currency in Nigerian Naira
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-NG', options);
};

/**
 * Truncate text to a specific length and add ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate a WhatsApp message link with pre-filled text
 */
export const generateWhatsAppLink = (
  phone: string,
  propertyName: string,
  location: string
): string => {
  const message = encodeURIComponent(
    `Hello iHomes Africa, I'm interested in ${propertyName} located at ${location}. Please provide more details.`
  );
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`;
};
