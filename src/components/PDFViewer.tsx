import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, AlertCircle } from 'lucide-react';

interface PDFViewerProps {
    url: string;
    onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, onClose }) => {
    // Check if URL is a local file path (which won't work in browser)
    const isLocalFilePath = url && (url.startsWith('file:///') || url.startsWith('C:') || url.startsWith('/Users'));

    // Handle URL - ensure it's properly formatted for web access
    const getFullUrl = () => {
        if (!url) return '';

        // If it's a local file path, we can't load it in the browser
        if (isLocalFilePath) {
            return '';
        }

        // If URL is already absolute with http/https, use it
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        // If it starts with /uploads, prepend the backend URL
        if (url.startsWith('/uploads')) {
            return `http://localhost:3000${url}`;
        }

        // Otherwise, assume it's a relative path to the backend
        return `http://localhost:3000${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const fullUrl = getFullUrl();

    const handleDownload = () => {
        if (isLocalFilePath) {
            // For local files, show an alert
            alert('This file is stored locally and cannot be downloaded through the browser. Please upload the file to the server.');
            return;
        }
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = url.split('/').pop() || 'document.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenInNewTab = () => {
        if (isLocalFilePath) {
            alert('This file is stored locally and cannot be opened through the browser. Please upload the file to the server.');
            return;
        }
        window.open(fullUrl, '_blank');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-brand-primary to-brand-primary/90">
                        <h3 className="text-xl font-bold text-white">Document Viewer</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
                                title="Download"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Download</span>
                            </button>
                            <button
                                onClick={handleOpenInNewTab}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
                                title="Open in new tab"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="hidden sm:inline">Open</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-lg transition-all duration-300"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* PDF Content */}
                    <div className="flex-grow bg-gray-100">
                        {isLocalFilePath ? (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Local File Detected</h4>
                                <p className="text-gray-600 max-w-md mb-4">
                                    This document is stored as a local file on the server and cannot be displayed in the browser.
                                    Please upload the PDF file through the admin panel to make it accessible online.
                                </p>
                                <p className="text-sm text-gray-400 bg-gray-200 px-4 py-2 rounded-lg font-mono break-all">
                                    {url}
                                </p>
                            </div>
                        ) : fullUrl ? (
                            <iframe
                                src={`${fullUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                                className="w-full h-full border-none"
                                title="PDF Viewer"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">No document URL provided</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PDFViewer;
