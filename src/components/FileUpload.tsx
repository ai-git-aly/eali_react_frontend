import React, { useCallback, useState } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept = "*", label = "Upload File" }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setFileName(file.name);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    return (
        <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                className="hidden"
                id="file-upload"
                accept={accept}
                onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-gray-600">
                    {fileName ? (
                        <p className="font-medium text-blue-600">{fileName}</p>
                    ) : (
                        <>
                            <p className="mb-2 font-semibold">{label}</p>
                            <p className="text-sm">Drag and drop or click to select</p>
                        </>
                    )}
                </div>
            </label>
        </div>
    );
};

export default FileUpload;
