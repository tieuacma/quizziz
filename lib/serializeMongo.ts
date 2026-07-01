import type { ObjectId } from "mongodb";

export function serializeObjectId(value: unknown): unknown {
    // BSON ObjectId: { $oid: '...' } is also possible depending on serializer.
    if (!value) return value;

    // mongodb driver ObjectId has toHexString()
    if (typeof value === "object" && value && "toHexString" in value) {
        const oid = value as ObjectId & { toHexString(): string };
        return oid.toHexString();
    }

    // Handle extended JSON form
    if (typeof value === "object" && value && "$oid" in value) {
        return (value as { $oid: string }).$oid;
    }

    return value;
}

export type SerializedMongoDoc<T> = { [K in keyof T]: unknown } & {
    id?: string;
};

export function serializeMongoDoc<T extends Record<string, unknown>>(
    doc: T
): SerializedMongoDoc<T> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(doc)) {
        out[k] = serializeObjectId(v);
    }

    // Keep root `id` (e.g. quiz-10-vanhoa-vn); only map _id when no business id exists
    if ("_id" in out) {
        const hasBusinessId = typeof out.id === "string" && out.id.length > 0;
        if (!hasBusinessId) {
            out.id = serializeObjectId(out._id);
        }
        delete out._id;
    }

    return out as SerializedMongoDoc<T>;
}
