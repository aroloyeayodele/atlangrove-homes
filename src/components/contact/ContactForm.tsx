
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import * as api from '@/services/api';

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: '' // Added for completeness, though not in original API
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.submitContactForm({ 
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      
      toast({
        title: "Message Sent",
        description: "Thank you! We'll get back to you shortly.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
            </div>
            <div className="space-y-2">
                <label htmlFor="email">Email Address</label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your email" required />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label htmlFor="phone">Phone Number</label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(Optional)" />
            </div>
            <div className="space-y-2">
                 <label htmlFor="subject">Subject</label>
                 <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Inquiry about..." required />
            </div>
        </div>
        <div className="space-y-2">
            <label htmlFor="message">Your Message</label>
            <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="How can we help?" rows={6} required />
        </div>
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
    </form>
  );
};

export default ContactForm;
