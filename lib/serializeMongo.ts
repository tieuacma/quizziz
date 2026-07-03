import type { ObjectId } from "mongodb";

/**
 * CHỨC NĂNG: Chuyển đổi (Serialize) đối tượng ObjectId của MongoDB thành chuỗi string thường.
 */
export function serializeObjectId(value: unknown): unknown {
    if (!value) return value;

    // TH1: Object có hàm toHexString (đối tượng ObjectId chuẩn của mongodb driver)
    if (typeof value === "object" && value && "toHexString" in value) {
        const oid = value as ObjectId & { toHexString(): string };
        return oid.toHexString();
    }

    // TH2: Định dạng Extended JSON của MongoDB (dạng object { $oid: '...' })
    if (typeof value === "object" && value && "$oid" in value) {
        return (value as { $oid: string }).$oid;
    }

    return value;
}

export type SerializedMongoDoc<T> = { [K in keyof T]: unknown } & {
    id?: string;
};

/**
 * CHỨC NĂNG: Chuẩn hóa toàn bộ Doc từ MongoDB (Xóa bỏ hoàn toàn kiểu dữ liệu DB đặc thù, đưa _id về id string).
 */
export function serializeMongoDoc<T extends Record<string, unknown>>(
    doc: T
): SerializedMongoDoc<T> {
    const out: Record<string, unknown> = {};

    // Vòng lặp duyệt qua tất cả các trường để convert ObjectId thành string thường
    for (const [k, v] of Object.entries(doc)) {
        out[k] = serializeObjectId(v);
    }

    // Xử lý đồng bộ trường định danh: chuyển đổi từ _id (Mongo) sang id (hệ thống)
    if ("_id" in out) {
        const hasBusinessId = typeof out.id === "string" && out.id.length > 0;
        // Nếu không có id tùy biến (Business ID) -> Lấy chính mã _id đã serialize gán làm id
        if (!hasBusinessId) {
            out.id = serializeObjectId(out._id);
        }
        delete out._id; // Xóa bỏ trường _id gốc của Mongo tránh dư thừa
    }

    return out as SerializedMongoDoc<T>;
}