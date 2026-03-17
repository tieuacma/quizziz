import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb/client';
import { Product } from '@/models/product.model';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await connectToMongoDB();

        // Tìm kiếm linh hoạt hơn
        const product = await Product.findOne({
            $or: [
                { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, // Chỉ tìm theo _id nếu đúng định dạng ObjectId
                { id: id },     // Tìm theo trường 'id' (chuỗi quiz-1772...)
                { quizId: id }  // Hoặc trường 'quizId' tùy theo Schema bạn đặt
            ].filter(condition => Object.values(condition)[0] !== null)
        });

        if (!product) {
            console.log(`[API] Không tìm thấy sản phẩm với ID: ${id}`);
            return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("[API Error]:", error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}