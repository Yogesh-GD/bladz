import { useRef, useState } from 'react';
import { FiPaperclip, FiImage, FiFileText, FiMic, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '../utils/hooks/compressImage';

const MediaPicker = ({ media, setMedia }) => {
  const [expanded, setExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const fileInputRef = useRef();

  // 📦 Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let processedFile = file;
    if (file.type.startsWith('image')) {
      processedFile = await compressImage(file);
    }

    const previewURL = URL.createObjectURL(processedFile);
    setMedia({ file: processedFile, type: file.type, previewURL });
    setExpanded(false);
  };

  const triggerFileInput = (accept) => {
    fileInputRef.current.accept = accept;
    fileInputRef.current.click();
  };

  // 🎤 Audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      setRecorder(mediaRecorder);

      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const previewURL = URL.createObjectURL(blob);
        setMedia({ file: blob, type: 'audio/webm', previewURL });
        setIsRecording(false);
        setExpanded(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic permission denied:", err);
    }
  };

  const stopRecording = () => {
    if (recorder?.state === 'recording') recorder.stop();
  };

  const clearMedia = () => {
    setMedia(null);
    fileInputRef.current.value = '';
    setExpanded(false);
  };

  return (
    <div className="relative z-30">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xl text-pink-500 p-2 rounded-full hover:bg-[#2e364f] transition"
        title="Attach Media"
      >
        <FiPaperclip />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 250, damping: 18 }}
            className="absolute bottom-12 left-0 bg-[#1c2333] p-2 rounded-lg shadow-lg border border-gray-600 space-y-2"
          >
            <button onClick={() => triggerFileInput('image/*')} className="flex items-center gap-2 text-white hover:text-pink-400 text-sm">
              <FiImage /> Image
            </button>
            <button onClick={() => triggerFileInput('video/*')} className="flex items-center gap-2 text-white hover:text-pink-400 text-sm">
              📹 Video
            </button>
            <button onClick={() => triggerFileInput('.pdf,.doc,.docx')} className="flex items-center gap-2 text-white hover:text-pink-400 text-sm">
              <FiFileText /> Document
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 text-sm ${isRecording ? 'text-red-500' : 'text-white hover:text-pink-400'}`}
            >
              <FiMic /> {isRecording ? 'Stop' : 'Record'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {media && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-2 left-0 bg-[#1c2333] p-3 rounded-md shadow-lg w-72 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white font-medium">Preview</span>
              <button onClick={clearMedia} className="text-gray-400 hover:text-red-500">
                <FiX />
              </button>
            </div>

            {media.type.startsWith('image') && (
              <img src={media.previewURL} alt="Preview" className="w-full h-auto rounded-md" />
            )}
            {media.type.startsWith('video') && (
              <video src={media.previewURL} controls className="w-full h-auto rounded-md" />
            )}
            {media.type.startsWith('audio') && (
              <audio src={media.previewURL} controls className="w-full" />
            )}
            {(media.type.includes('pdf') || media.type.includes('doc')) && (
              <p className="text-sm text-gray-300">{media.file.name}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaPicker;
