import { useState } from 'react';
import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadModal = ({ open, onOpenChange, uploadDevice }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
    const [uploadMessage, setUploadMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.name.match(/\.(xlsx|xls)$/i)) {
                setUploadStatus('error');
                setUploadMessage('Please select a valid Excel file (.xlsx or .xls)');
                return;
            }
            setSelectedFile(file);
            setUploadStatus(null);
            setUploadMessage('');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (!file.name.match(/\.(xlsx|xls)$/i)) {
                setUploadStatus('error');
                setUploadMessage('Please select a valid Excel file (.xlsx or .xls)');
                return;
            }
            setSelectedFile(file);
            setUploadStatus(null);
            setUploadMessage('');
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setUploadStatus('error');
            setUploadMessage('Please select a file to upload');
            return;
        }

        setIsSubmitting(true);
        setUploadStatus(null);

        try {
            const formData = new FormData();
            formData.append('device', selectedFile);
            
            // Call the upload function passed from parent
            await uploadDevice(formData);
            
            setUploadStatus('success');
            setUploadMessage('Devices uploaded successfully!');
            
            // Reset form after 2 seconds
            setTimeout(() => {
                setSelectedFile(null);
                setUploadStatus(null);
                setUploadMessage('');
                onOpenChange(false);
            }, 2000);
            
        } catch (error) {
            setUploadStatus('error');
            setUploadMessage(error.message || 'Upload failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (!isSubmitting) {
            setSelectedFile(null);
            setUploadStatus(null);
            setUploadMessage('');
            onOpenChange(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md dark:bg-gray-900 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="dark:text-gray-100">Upload Devices</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* File Upload Area */}
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            selectedFile 
                                ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20' 
                                : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={isSubmitting}
                        />

                        <AnimatePresence mode="wait">
                            {selectedFile ? (
                                <motion.div
                                    key="file-selected"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full">
                                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                    {!isSubmitting && (
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="file-upload"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Drop your Excel file here
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            or{' '}
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                                disabled={isSubmitting}
                                            >
                                                browse files
                                            </button>
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Supports .xlsx and .xls files
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Status Messages */}
                    <AnimatePresence>
                        {(uploadStatus || uploadMessage) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`flex items-center space-x-2 p-3 rounded-lg ${
                                    uploadStatus === 'success'
                                        ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                        : uploadStatus === 'error'
                                        ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                        : 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                }`}
                            >
                                {uploadStatus === 'success' && <CheckCircle className="w-4 h-4" />}
                                {uploadStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                                <p className="text-sm font-medium">{uploadMessage}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submitting State */}
                    <AnimatePresence>
                        {isSubmitting && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center justify-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                            >
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                                    Uploading devices...
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedFile || isSubmitting || uploadStatus === 'success'}
                        className="dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Devices
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UploadModal;
