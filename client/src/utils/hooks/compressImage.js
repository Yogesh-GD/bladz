import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const compressedBlob = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  });

  const extension = file.name.split('.').pop();
  const newFile = new File(
    [compressedBlob],
    `${Date.now()}-${file.name}`, 
    { type: compressedBlob.type }
  );

  return newFile;
};
