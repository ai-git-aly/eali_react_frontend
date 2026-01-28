import React from 'react';
import { X, Clock, GraduationCap, CheckCircle2, Briefcase, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProgramDetails {
    id: number;
    name_en: string;
    name_fr: string;
    type: string;
    icon: string;
    options_en?: string[];
    options_fr?: string[];
    description_en?: string;
    description_fr?: string;
    duration?: string;
    degree_en?: string;
    degree_fr?: string;
    admission_requirements_en?: string;
    admission_requirements_fr?: string;
    career_opportunities_en?: string;
    career_opportunities_fr?: string;
    image_url?: string;
}

interface ProgramDetailsModalProps {
    program: ProgramDetails | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({ program, isOpen, onClose }) => {
    const { t, i18n } = useTranslation();

    if (!program) return null;

    const name = i18n.language === 'fr' ? program.name_fr : program.name_en;
    const description = i18n.language === 'fr' ? program.description_fr : program.description_en;
    const degree = i18n.language === 'fr' ? program.degree_fr : program.degree_en;
    const options = i18n.language === 'fr' ? program.options_fr : program.options_en;
    const admissionReqs = i18n.language === 'fr' ? program.admission_requirements_fr : program.admission_requirements_en;
    const careerOpps = i18n.language === 'fr' ? program.career_opportunities_fr : program.career_opportunities_en;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Banner Image */}
                        <div className="relative h-48 md:h-64 bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-secondary overflow-hidden">
                            {program.image_url && (
                                <img
                                    src={program.image_url}
                                    alt={name}
                                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${program.type === 'faculty'
                                            ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
                                            : 'bg-orange-500/20 text-orange-100 border border-orange-400/30'
                                        }`}>
                                        {program.type === 'faculty' ? t('faculties') : t('professional_courses')}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                                    {name}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-16rem)] p-6 md:p-8 space-y-6">
                            {/* Quick Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {program.duration && (
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
                                        <div className="p-3 rounded-lg bg-brand-primary/10">
                                            <Clock className="w-6 h-6 text-brand-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 font-medium">{t('duration')}</p>
                                            <p className="text-lg font-semibold text-slate-800">{program.duration}</p>
                                        </div>
                                    </div>
                                )}
                                {degree && (
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
                                        <div className="p-3 rounded-lg bg-brand-secondary/10">
                                            <GraduationCap className="w-6 h-6 text-brand-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 font-medium">{t('degree_awarded')}</p>
                                            <p className="text-lg font-semibold text-slate-800">{degree}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {description && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-brand-primary" />
                                        {t('about')}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">{description}</p>
                                </div>
                            )}

                            {/* Specializations/Options */}
                            {options && options.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-brand-secondary" />
                                        {t('specializations')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {options.map((option, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/10"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                                                <span className="text-slate-700 font-medium">{option}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Admission Requirements */}
                            {admissionReqs && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        {t('admission_requirements')}
                                    </h3>
                                    <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{admissionReqs}</p>
                                    </div>
                                </div>
                            )}

                            {/* Career Opportunities */}
                            {careerOpps && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-purple-600" />
                                        {t('career_opportunities')}
                                    </h3>
                                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{careerOpps}</p>
                                    </div>
                                </div>
                            )}

                            {/* Apply Button */}
                            <div className="pt-4 border-t border-slate-100">
                                <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                    {t('apply_for_program')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProgramDetailsModal;
