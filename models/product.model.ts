// models/product.model.ts
import mongoose, { Schema, model, models } from 'mongoose';

// Interface giúp bạn có gợi ý code (intelliSense) khi dùng TS
export interface IProduct {
    name: string;
    price: number;
    description?: string;
    createdAt?: Date;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Chỉ tạo model nếu nó chưa tồn tại (tránh lỗi khi hot-reload)
export const Product = models.Product || model<IProduct>('Product', ProductSchema);