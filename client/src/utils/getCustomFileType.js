export const getCustomFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType === 'application/pdf' ||
    mimeType === 'application/msword' ||
    mimeType.includes('officedocument') ||
    mimeType === 'text/plain'
  ) return 'file';

  return 'file'; 
};
