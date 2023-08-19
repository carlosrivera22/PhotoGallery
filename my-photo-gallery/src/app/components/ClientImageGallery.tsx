import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getImages } from '../services/file.service';
import { uploadImage } from '../services/file.service';

export default function ClientImageGallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const images = await getImages();
    setImages(images.map((image: { data: string; }) => image.data));
  }


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      setImages((prevImages) => [...prevImages, result]);
    };

    if (file) {
      reader.readAsDataURL(file);
      const res = await uploadImage(file);
      console.log("res", res);
    }
    //clear the input after upload
    e.target.value = "";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="col-span-full text-center mb-4">
        <input type="file" className="file-input file-input-bordered file-input-warning w-full max-w-xs"
        onChange={handleImageUpload}
         />
      </div>
      {images.map((data, index) => (
        <div
          key={index}
          className="border rounded overflow-hidden shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: 'yourColor', width: '400px', height: '400px' }}
        >
          <Image
            src={data}
            alt={`Image ${index}`}
            width={400}
            height={400}
            layout="responsive"
            objectFit="cover"
          />
        </div>
      ))}
    </div>
  );
}
