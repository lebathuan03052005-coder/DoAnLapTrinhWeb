export function formatCurrency(value) {
  if (value === null || value === undefined) return "";
  // Accept numbers or numeric strings like "1200000.00"
  const n =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.-]+/g, ""));
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString("vi-VN");
}

export default formatCurrency;
