import imageCompression from "browser-image-compression";

export { COVER_TRANSFORM, THUMB_TRANSFORM, cloudinaryUrl } from "@/lib/blog/cloudinary-url";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type UploadedImage = {
  url: string;
  publicId: string;
  width: number;
  height: number;
};

export function postImageFolder(postId: string) {
  return `almuallim/blog/${postId}`;
}

// Unsigned upload straight from the browser. Only the cloud name and preset name are used here;
// the Cloudinary API secret must never reach the front end.
export async function uploadImage(file: File, folder: string, onProgress?: (percent: number) => void) {
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary is not configured. Set the NEXT_PUBLIC_CLOUDINARY_* variables.");
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Please choose a JPG, PNG or WebP image.");
  }

  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 2000,
    maxSizeMB: 2,
    initialQuality: 0.85,
    useWebWorker: true,
  });

  if (compressed.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is still larger than 5 MB after compression. Try a smaller image.");
  }

  const body = new FormData();
  body.append("file", compressed, file.name);
  body.append("upload_preset", uploadPreset);
  body.append("folder", folder);

  // XMLHttpRequest instead of fetch so the upload can report progress.
  return new Promise<UploadedImage>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText || "{}");

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          width: response.width,
          height: response.height,
        });
      } else {
        reject(new Error(response.error?.message ?? "Upload failed. Please try again."));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload. Check your connection."));
    xhr.send(body);
  });
}
