const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// Builds a delivery URL with a transformation, e.g. "c_fill,g_auto,w_1200,h_675,q_auto,f_auto".
export function cloudinaryUrl(publicId: string, transform: string) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}

export const COVER_TRANSFORM = "c_fill,g_auto,w_1200,h_675,q_auto,f_auto";
export const THUMB_TRANSFORM = "c_fill,g_auto,w_240,h_135,q_auto,f_auto";
export const CARD_TRANSFORM = "c_fill,g_auto,w_720,h_405,q_auto,f_auto";
export const OG_TRANSFORM = "c_fill,g_auto,w_1200,h_630,q_auto,f_jpg";
