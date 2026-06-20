// utils/getImageUrl.js
const BACKEND_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export const getImageUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;
  const fname = filePath.split("/").pop();
  return `${BACKEND_BASE_URL}/uploads/${fname}`;
};

export default getImageUrl;
