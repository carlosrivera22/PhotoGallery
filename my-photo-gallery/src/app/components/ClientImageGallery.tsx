import { useState } from 'react';
import Image from 'next/image';

export default function ClientImageGallery() {
  const [images, setImages] = useState<string[]>([
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      setImages((prevImages) => [...prevImages, result]);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="col-span-full text-center mb-4">
        <input type="file" className="file-input file-input-bordered file-input-warning w-full max-w-xs" />
      </div>
      {images.map((src, index) => (
        <div key={index} className="border rounded overflow-hidden shadow-lg transition-transform hover:scale-105">
          <Image src={src} alt={`Image ${index}`} width={400} height={300} layout="responsive" />
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-700">Image Title {index + 1}</h2>
            <p className="text-sm text-gray-500">Description for the image.</p>
          </div>
        </div>
      ))}
    </div>
  );
}
