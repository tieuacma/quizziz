import { NextResponse } from 'next/server';
// import { connectToMongoDB } from '@/lib/mongodb/client'; 
// import { User } from '@/models/user.model';

export async function GET(request: Request) {
    // 1. Kiểm tra xác thực (nếu cần)
    // 2. Lấy dữ liệu từ DB
    // await connectToMongoDB();
    // const user = await User.find({}); 

    return NextResponse.json({
        message: "Endpoint user đang hoạt động",
        status: "success"
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    // Logic tạo user mới ở đây
    return NextResponse.json({ message: "User đã được tạo" }, { status: 201 });
}