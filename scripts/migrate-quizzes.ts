import fs from 'fs/promises';
import path from 'path';
import { connectToMongoDB } from '@/lib/mongodb/client';
import { Quiz } from '@/models/quiz.model';

const QUIZZIZ_DIR = path.join(process.cwd(), 'data/admin/quizziz');
const OVERVIEW_FILE = path.join(process.cwd(), 'data/admin/quizziz.json');

async function migrate() {
    try {
        await connectToMongoDB();
        console.log('✅ Connected to MongoDB');

        // 1. Read overview file
        let overviewData: any[] = [];
        try {
            const overview = await fs.readFile(OVERVIEW_FILE, 'utf-8');
            overviewData = JSON.parse(overview || '[]');
            console.log(`📋 Found ${overviewData.length} quizzes in overview`);
        } catch (e) {
            console.log('⚠️ No overview file found');
        }

        // 2. Migrate detail files
        const detailFiles = await fs.readdir(QUIZZIZ_DIR);
        const quizFiles = detailFiles.filter(f => f.endsWith('.json') && f.startsWith('quiz-'));

        console.log(`🔄 Processing ${quizFiles.length} detail files...`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const file of quizFiles) {
            try {
                const filePath = path.join(QUIZZIZ_DIR, file);
                const data = await fs.readFile(filePath, 'utf-8');
                const quizData = JSON.parse(data);

                // Check if already exists in MongoDB
                const existing = await Quiz.findById(quizData.id);
                if (existing) {
                    console.log(`⏭️  Skip ${quizData.id} (already exists)`);
                    skippedCount++;
                    continue;
                }

                // Prepare data for MongoDB (string _id)
                const mongoData = {
                    _id: quizData.id,
                    title: quizData.title,
                    subject: quizData.subject || '',
                    classId: quizData.classId || '',
                    description: quizData.description || '',
                    questions: quizData.questions || [],
                    createdAt: new Date(quizData.createdAt || Date.now()),
                    updatedAt: new Date(quizData.updatedAt || Date.now()),
                };

                await Quiz.create(mongoData);
                console.log(`✅ Migrated ${quizData.id}`);
                migratedCount++;
            } catch (e) {
                console.error(`❌ Error migrating ${file}:`, e);
            }
        }

        // Migrate overview-only quizzes (fallback)
        for (const overviewQuiz of overviewData) {
            const existing = await Quiz.findById(overviewQuiz.id);
            if (existing) continue;

            try {
                const mongoData = {
                    _id: overviewQuiz.id,
                    title: overviewQuiz.title,
                    subject: overviewQuiz.subject || '',
                    classId: overviewQuiz.classId || '',
                    description: overviewQuiz.description || '',
                    questions: [],
                    createdAt: new Date(overviewQuiz.createdAt),
                    updatedAt: new Date(),
                };

                await Quiz.create(mongoData);
                console.log(`✅ Migrated overview ${overviewQuiz.id}`);
                migratedCount++;
            } catch (e) {
                console.log(`⚠️ Skip overview ${overviewQuiz.id}:`, e);
            }
        }

        console.log(`\n🎉 Migration complete! Migrated: ${migratedCount}, Skipped: ${skippedCount}`);
    } catch (error) {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    }
}

migrate().then(() => process.exit(0));

