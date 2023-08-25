export async function getImages() {
  const res = await fetch("http://localhost:3001/files");
  const images = await res.json();
  return images;
}

export async function uploadImage(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const res = await fetch("http://localhost:3001/files/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data;
}

export async function deleteImage(filename: string) {
  await fetch(`http://localhost:3001/files/${filename}`, {
    method: "DELETE",
  });
}
