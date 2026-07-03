import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB =
    process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || "quizzes";

// Biến global lưu Promise kết nối (Singleton pattern chống tạo nhiều kết nối khi Next.js hot-reload)
let clientPromise: Promise<MongoClient> | null = null;

/**
 * CHỨC NĂNG: Khởi tạo và quản lý client kết nối MongoDB (tạo 1 instance duy nhất).
 */
function getClientPromise(): Promise<MongoClient> {
    if (!clientPromise) {
        if (!MONGODB_URI) {
            // Thiếu URI cấu hình -> Return Promise lỗi
            clientPromise = Promise.reject(
                new Error("MONGODB_URI environment variable is not set")
            );
        } else {
            const client = new MongoClient(MONGODB_URI, {});
            clientPromise = client.connect(); // Kích hoạt connect DB
        }
    }
    return clientPromise;
}

/**
 * CHỨC NĂNG: Lấy về instance Database (Db) tương ứng để thực hiện câu lệnh query.
 */
export async function getMongoDb(): Promise<Db> {
    const client = await getClientPromise();
    return client.db(MONGODB_DB);
}

/**
 * CHỨC NĂNG: Lấy trực tiếp Collection "quizzes" để CRUD dữ liệu bài test.
 */
export async function getQuizzesCollection() {
    const db = await getMongoDb();
    return db.collection("quizzes");
}

/** * CHỨC NĂNG: Hàm cũ (Hạn chế dùng, trỏ ngược về hàm getQuizzesCollection mới).
 * @deprecated Use getQuizzesCollection 
 */
export async function getQuestionsCollection() {
    return getQuizzesCollection();
}