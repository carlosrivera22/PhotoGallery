import { useEffect, useState } from "react";
import Image from "next/image";
import { getImages } from "../services/file.service";
import { uploadImage, deleteImage } from "../services/file.service";

export default function ClientImageGallery() {
  const [images, setImages] = useState<
    {
      name: string;
      data: string;
    }[]
  >([]);
  const [menuIndex, setMenuIndex] = useState<number | null>(null); // State to manage which menu is open
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    fetchImages(page);
  }, []);

  const fetchImages = async (page: number) => {
    const imagesData = await getImages(page);
    setImages(imagesData);
    return imagesData;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    if (file) {
      // Read the file
      reader.readAsDataURL(file);

      // Await the upload
      await uploadImage(file);
      // Add the image to state
      await fetchImages(page);
    }

    // Clear the input after upload
    e.target.value = "";
  };

  const handleDelete = async (index: number) => {
    await deleteImage(images[index].name);
    await fetchImages(page);
    setMenuIndex(null); // Close the menu
  };

  const toggleMenu = (index: number) => {
    setMenuIndex(menuIndex === index ? null : index);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-full text-center mb-1 mt-5">
          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            onChange={handleImageUpload}
            accept="image/png, image/jpeg"
          />
        </div>
        {images.map((img, index) => (
          <div
            key={index}
            className="border rounded overflow-hidden shadow-lg transition-transform hover:scale-105 relative"
            style={{ height: "300px", width: "350px", marginTop: "3rem" }}
          >
            <button
              className="btn btn-square btn-sm absolute top-0 right-0 m-2 z-10"
              style={{ backgroundColor: "white" }}
              onClick={() => toggleMenu(index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </button>
            {menuIndex === index && (
              <div className="absolute top-0 right-2 mt-10 bg-white border rounded shadow z-20">
                <button
                  className="btn-xs p-1 hover:bg-gray-100 flex items-center"
                  onClick={() => handleDelete(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7h18M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12m-3-4V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M9 7h6"
                    />
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
      <div className="join flex justify-center items-center mt-20 mb-10">
        <button
          onClick={async () => {
            if (page === 1) return;
            await fetchImages(page - 1);
            setPage(page - 1);
          }}
          className="join-item btn bg-primary text-white"
        >
          «
        </button>
        <button className="join-item btn bg-primary text-white">
          Page {page}
        </button>
        <button
          onClick={async () => {
            const images = await fetchImages(page + 1);
            if (images.length === 0) {
              await fetchImages(page);
              return;
            }
            setPage(page + 1);
          }}
          className="join-item btn bg-primary text-white"
        >
          »
        </button>
      </div>
    </>
  );
}
