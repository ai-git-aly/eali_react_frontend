// Updated ContactForm.tsx

import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/contact', { name, email, message }); // Fixed endpoint
            alert('Message sent!');
        } catch (error) {
            alert('Error sending message.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your Email" required />
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your Message" required />
            <button type="submit">Send</button>
        </form>
    );
};

export default ContactForm;