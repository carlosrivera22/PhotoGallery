"use client";
import ClientImageGallery from "./components/ClientImageGallery";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl mb-4 text-center font-bold text-gray-800">
        Photo Gallery
      </h1>
      <ClientImageGallery />
    </main>
  );
}
