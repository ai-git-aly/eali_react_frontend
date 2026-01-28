import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';

const Contact: React.FC = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Message sent! (This is a demo)');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/5 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-brand-secondary/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <RevealOnScroll direction="right">
                        <h2 className="text-sm font-semibold text-brand-secondary tracking-widest uppercase mb-2">{t('contact')}</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{t('contact_us')}</h3>
                        <p className="text-slate-600 mb-8 text-lg">
                            {t('building_future_leaders')}
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-secondary group-hover:bg-brand-primary/20 transition-all duration-300">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-semibold">{t('call_us')}</h4>
                                    <p className="text-slate-600">+257 22 30 63 01</p>
                                    <p className="text-slate-500 text-sm">{t('mon_fri')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-brand-secondary/10 text-brand-primary group-hover:bg-brand-secondary/20 transition-all duration-300">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-semibold">{t('email_us')}</h4>
                                    <p className="text-slate-600">info@eali.bi</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-secondary group-hover:bg-brand-primary/20 transition-all duration-300">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-semibold">{t('visit_us')}</h4>
                                    <p className="text-slate-600">Muyinga-Kibogoye, B.P 60</p>
                                    <p className="text-slate-600">Burundi</p>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll direction="left" className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                        <h4 className="text-xl font-bold text-slate-900 mb-6">{t('send_message')}</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">{t('your_full_name')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all duration-300 placeholder:text-slate-400"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">{t('your_email_address')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all duration-300 placeholder:text-slate-400"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">{t('subject_of_message')}</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all duration-300 placeholder:text-slate-400"
                                    placeholder="Inquiry about programs"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">{t('type_your_message')}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all duration-300 resize-none placeholder:text-slate-400"
                                    placeholder="Hello, I would like to know..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white font-bold py-4 rounded-xl transition-all duration-500 shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 group"
                            >
                                {t('submit')} <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>
                    </RevealOnScroll>
                </div>

                {/* Google Maps Section */}
                <RevealOnScroll direction="up" className="mt-16">
                    <h4 className="text-xl font-bold text-slate-900 mb-6 text-center">{t('our_location') || 'Our Location'}</h4>
                    <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63738.41!2d30.25!3d-2.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c147a09b4d8f35%3A0xdeeaa1bb18764c93!2sMuyinga%2C%20Burundi!5e0!3m2!1sen!2sus!4v1706434400000!5m2!1sen!2sus"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="EALI Location - Muyinga-Kibogoye, B.P 60 Muyinga, Burundi"
                            className="w-full"
                        />
                    </div>
                    <p className="text-center text-slate-600 mt-4">
                        <span className="font-medium">EALI</span> - Muyinga-Kibogoye, B.P 60 Muyinga, Burundi
                    </p>
                </RevealOnScroll>
            </div>
        </div>
    );
};

export default Contact;
