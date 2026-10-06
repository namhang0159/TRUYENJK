/**
 * Chuyển đổi chuỗi tiếng Việt có dấu thành slug chuẩn SEO (kebab-case)
 * Ví dụ: "Vân Thiên" -> "van-thien"
 *        "Đường Đời & Kỵ Sĩ" -> "duong-doi-ky-si"
 */
export function generateSlug(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    // Thay thế các ký tự đặc trưng tiếng Việt
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    // Chuẩn hóa Unicode NFD để loại bỏ triệt để các dấu phụ còn sót lại
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Loại bỏ ký tự đặc biệt không phải chữ cái a-z, số 0-9 và khoảng trắng
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    // Thay thế nhiều khoảng trắng hoặc gạch dưới thành một gạch nối đơn
    .replace(/[\s_-]+/g, '-')
    // Xóa dấu gạch nối ở đầu hoặc cuối
    .replace(/^-+|-+$/g, '');
}
