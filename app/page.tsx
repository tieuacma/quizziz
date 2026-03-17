"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, Shield } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Quizizz Clone
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Tạo và chơi các bài quiz tương tác. Dành cho giáo viên và học sinh.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Sẵn sàng bắt đầu?</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Đăng nhập để quản lý quizzes hoặc truy cập dashboard admin.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full flex items-center gap-2 text-lg h-14">
                  <LogIn className="h-5 w-5" />
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="w-full flex items-center gap-2 text-lg h-14">
                  <UserPlus className="h-5 w-5" />
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1524178232363-7527e22005e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
              alt="Quiz interface"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <Shield className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quản lý quizzes, lớp học, theo dõi tiến độ học sinh với quyền admin.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <svg className="h-12 w-12 text-purple-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <CardTitle className="text-2xl">Dễ sử dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Giao diện trực quan, tạo quiz chỉ trong vài phút.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <svg className="h-12 w-12 text-emerald-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <CardTitle className="text-2xl">Nhanh chóng</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Tải nhanh, hoạt động mượt mà trên mọi thiết bị.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

