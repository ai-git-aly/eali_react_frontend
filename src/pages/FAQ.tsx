import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import api, { FAQ } from '../services/api';

const FAQPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const isFrench = i18n.language === 'fr';

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const response = await api.get('/faqs');
            setFaqs(response.data);
        } catch (err) {
            console.error('Failed to fetch FAQs', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-dark py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <RevealOnScroll>
                        <HelpCircle className="w-16 h-16 mx-auto mb-6 text-white" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {t('faq_title') || 'Frequently Asked Questions'}
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            {t('faq_subtitle') || 'Find answers to the most common questions about EALI'}
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading FAQs...</p>
                        </div>
                    ) : faqs.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                            <HelpCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {t('no_faqs') || 'No FAQs Available'}
                            </h3>
                            <p className="text-gray-500">
                                {t('no_faqs_message') || 'Check back later for frequently asked questions.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <RevealOnScroll key={faq.id} direction="up" delay={index * 0.1}>
                                    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                                        <button
                                            onClick={() => toggleQuestion(index)}
                                            className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                                        >
                                            <span className="font-semibold text-lg text-slate-800 pr-4">
                                                {isFrench ? faq.question_fr : faq.question_en}
                                            </span>
                                            {openIndex === index ? (
                                                <ChevronUp className="w-5 h-5 text-brand-primary flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>
                                        <div 
                                            className={`overflow-hidden transition-all duration-300 ${
                                                openIndex === index ? 'max-h-96' : 'max-h-0'
                                            }`}
                                        >
                                            <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                                {isFrench ? faq.answer_fr : faq.answer_en}
                                            </div>
                                        </div>
                                    </div>
                                </RevealOnScroll>
                            ))}
                        </div>
                    )}

                    {/* Contact CTA */}
                    <RevealOnScroll direction="up" className="mt-12">
                        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl p-8 text-center">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                {t('faq_contact_title') || 'Still have questions?'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {t('faq_contact_message') || "Can't find the answer you're looking for? Contact us."}
                            </p>
                            <button
                                onClick={() => navigate('/#contact')}
                                className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors duration-300"
                            >
                                {t('contact_us') || 'Contact Us'}
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
