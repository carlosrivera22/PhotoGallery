import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getImages } from '../services/file.service';
import { uploadImage, deleteImage } from '../services/file.service';

export default function ClientImageGallery() {
  const [images, setImages] = useState<{
    name: string;
    data: string;
  }[]>([]);
  const [menuIndex, setMenuIndex] = useState<number | null>(null); // State to manage which menu is open

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    console.debug("images: ", images);
  }, [images]);

  const fetchImages = async () => {
    setImages(await getImages());
  }


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    if (file) {
      // Read the file
      reader.readAsDataURL(file);
      
      // Await the upload
      const res = await uploadImage(file);
      console.log(res);
      // Add the image to state
      setImages([...images, { name: file.name, data: res.data }]);

    }

    // Clear the input after upload
    e.target.value = "";
  };

  const handleDelete = async (index: number) => {
    // You can handle the delete action here.
    // This example simply removes the image from the state
    setImages(images.filter((_, idx) => idx !== index));
    alert(images[index].name);
    await deleteImage(images[index].name)
    setMenuIndex(null); // Close the menu
  };

  const toggleMenu = (index: number) => {
    setMenuIndex(menuIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="col-span-full text-center mb-4">
        <input type="file" className="file-input file-input-bordered file-input-warning w-full max-w-xs"
        onChange={handleImageUpload}
         />
      </div>
      {images.map((img, index) => (
      <div
        key={index}
        className="border rounded overflow-hidden shadow-lg transition-transform hover:scale-105 relative"
        style={{ height: '300px', width: '400px', marginTop: '5rem' }}
      >
       <button className="btn btn-square btn-sm absolute top-0 right-0 m-2 z-10" style={{ backgroundColor: 'white' }} onClick={() => toggleMenu(index)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
         {menuIndex === index && (
            <div className="absolute top-0 right-2 mt-10 bg-white border rounded shadow z-20">
              <button className="btn-xs p-1 hover:bg-gray-100 flex items-center" onClick={() => handleDelete(index)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12m-3-4V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M9 7h6" />
                </svg>
                Delete
              </button>
            </div>
          )}
        <Image
          src={img.data}
          alt={`Image ${index}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
    ))}

    </div>
  );
}
