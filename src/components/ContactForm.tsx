import React, { useState } from 'react';
import { Send, User, Mail, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ROUTE } from '../../config';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !content) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_ROUTE}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, content }),
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.', {
          duration: 5000,
          position: 'bottom-center',
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            padding: '16px',
            borderRadius: '8px',
          },
        });
        setName('');
        setEmail('');
        setSubject('');
        setContent('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again later.', {
        duration: 5000,
        position: 'bottom-center',
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg 
    border border-gray-300 
    bg-white 
    text-gray-900
    placeholder-gray-500
    focus:ring-2 focus:ring-brand-primary 
    focus:border-brand-primary 
    transition-all duration-300`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className={`${inputClass} pl-10`}
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className={`${inputClass} pl-10`}
          />
        </div>
      </div>

      <div className="relative">
        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          required
          className={`${inputClass} pl-10`}
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Your message"
        required
        rows={5}
        className={inputClass}
      ></textarea>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-primary
          text-white px-6 py-3 rounded-lg 
          hover:bg-brand-primary/90
          focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 
          disabled:opacity-50 disabled:cursor-not-allowed 
          transition-all duration-300
          flex items-center justify-center gap-2
          font-semibold"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}