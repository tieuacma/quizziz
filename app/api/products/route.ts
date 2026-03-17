import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb/client';
import { Product } from '@/models/product.model';

// 1. GET: Lấy danh sách sản phẩm
export async function GET() {
    try {
        await connectToMongoDB();
        const products = await Product.find({}); // Lấy toàn bộ sản phẩm
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Không thể lấy dữ liệu sản phẩm' }, { status: 500 });
    }
}

// 2. POST: Thêm sản phẩm mới
export async function POST(request: Request) {
    try {
        await connectToMongoDB();
        const body = await request.json();

        // Tạo mới dựa trên model
        const newProduct = await Product.create(body);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Không thể tạo sản phẩm' }, { status: 400 });
    }
}