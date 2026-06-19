export const removeDiacritics = (str) =>
  (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")   // ← THÊM DÒNG NÀY
    .replace(/Đ/g, "D")   // ← THÊM DÒNG NÀY
    .toLowerCase()
    .trim();