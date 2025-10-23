import { useState } from 'react';
import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Upload, FileText, X, CheckCircle, AlertCircle, FileSpreadsheet, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const EnhancedUploadModal = ({ open, onOpenChange, uploadDevice }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file) => {
        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            setUploadStatus('error');
            setUploadMessage('Please select a valid Excel file (.xlsx or .xls)');
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setUploadStatus('error');
            setUploadMessage('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        setUploadStatus(null);
        setUploadMessage('');
        setUploadProgress(0);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const simulateProgress = () => {
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + Math.random() * 15;
            });
        }, 200);
        return interval;
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setUploadStatus('error');
            setUploadMessage('Please select a file to upload');
            return;
        }

        setIsSubmitting(true);
        setUploadStatus(null);
        setUploadProgress(0);

        // Start progress simulation
        const progressInterval = simulateProgress();

        try {
            const formData = new FormData();
            formData.append('customer', selectedFile);

            await uploadDevice(formData);

            clearInterval(progressInterval);
            setUploadProgress(100);

            setUploadStatus('success');
            setUploadMessage('Devices uploaded successfully! Processing data...');

            setTimeout(() => {
                setSelectedFile(null);
                setUploadStatus(null);
                setUploadMessage('');
                setUploadProgress(0);
                onOpenChange(false);
            }, 3000);

        } catch (error) {
            clearInterval(progressInterval);
            setUploadStatus('error');
            setUploadMessage(error.message || 'Upload failed. Please try again.');
            setUploadProgress(0);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (!isSubmitting) {
            setSelectedFile(null);
            setUploadStatus(null);
            setUploadMessage('');
            setUploadProgress(0);
            setIsDragOver(false);
            onOpenChange(false);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadStatus(null);
        setUploadMessage('');
        setUploadProgress(0);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatLastModified = (timestamp) => {
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg dark:bg-gray-900 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="dark:text-gray-100 flex items-center space-x-2">
                        <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span>Upload Manufacturer Data</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                            <p className="font-medium mb-1">Upload Requirements:</p>
                            <ul className="text-xs space-y-1">
                                <li>• Excel files only (.xlsx)</li>
                                <li>• Maximum file size: 10MB</li>
                                <li>• Required columns: name,email</li>
                            </ul>
                        </div>
                    </div>

                    <div
                        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${isDragOver
                                ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
                                : selectedFile
                                    ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20'
                                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
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
                                    <div className="flex items-center justify-center w-14 h-14 mx-auto bg-green-100 dark:bg-green-900 rounded-full">
                                        <FileText className="w-7 h-7 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                                        <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span>{formatFileSize(selectedFile.size)}</span>
                                            <span>•</span>
                                            <span>{formatLastModified(selectedFile.lastModified)}</span>
                                        </div>
                                    </div>
                                    {!isSubmitting && (
                                        <button
                                            onClick={handleRemoveFile}
                                            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors group"
                                            title="Remove file"
                                        >
                                            <X className="w-4 h-4 text-gray-400 group-hover:text-red-500 dark:text-gray-500 dark:group-hover:text-red-400" />
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="file-upload"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-center w-14 h-14 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <Upload className={`w-7 h-7 transition-colors ${isDragOver
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-400 dark:text-gray-500'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {isDragOver ? 'Drop your file here' : 'Drop your Excel file here'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            or{' '}
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                                                disabled={isSubmitting}
                                            >
                                                browse files
                                            </button>
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Maximum file size: 10MB
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {isSubmitting && uploadProgress > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-2"
                            >
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700 dark:text-gray-300">Uploading...</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">{Math.round(uploadProgress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {(uploadStatus || uploadMessage) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`flex items-start space-x-3 p-4 rounded-lg ${uploadStatus === 'success'
                                        ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                        : uploadStatus === 'error'
                                            ? 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                            : 'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                                    }`}
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    {uploadStatus === 'success' && (
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    )}
                                    {uploadStatus === 'error' && (
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${uploadStatus === 'success'
                                            ? 'text-green-800 dark:text-green-400'
                                            : uploadStatus === 'error'
                                                ? 'text-red-800 dark:text-red-400'
                                                : 'text-blue-800 dark:text-blue-400'
                                        }`}>
                                        {uploadMessage}
                                    </p>
                                    {uploadStatus === 'success' && (
                                        <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                                            You can close this dialog or it will close automatically.
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isSubmitting && !uploadMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center justify-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                            >
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                                    Processing your file...
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {!isSubmitting && (
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedFile || isSubmitting || uploadStatus === 'success'}
                        className={`min-w-[120px] ${uploadStatus === 'success'
                                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                                : 'dark:bg-blue-700 dark:hover:bg-blue-600'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                            </>
                        ) : uploadStatus === 'success' ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Uploaded
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Manufacturers
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EnhancedUploadModal;
