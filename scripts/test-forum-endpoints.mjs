import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile(name) {
    const p = resolve(process.cwd(), name);
    if (!existsSync(p)) return;
    for (const line of readFileSync(p, "utf8").split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf("=");
        if (i === -1) continue;
        const key = t.slice(0, i).trim();
        let val = t.slice(i + 1).trim();
        if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
        ) {
            val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
    }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const student1 = {
    userId: "test_student_1",
    email: "student1@zenith.edu.vn",
    name: "Nguyễn Văn A",
    role: "student",
};

const student2 = {
    userId: "test_student_2",
    email: "student2@zenith.edu.vn",
    name: "Trần Thị B",
    role: "student",
};

const teacher = {
    userId: "test_teacher_1",
    email: "teacher1@zenith.edu.vn",
    name: "Thầy Bình",
    role: "teacher",
};

function getCookie(user) {
    const encoded = Buffer.from(JSON.stringify(user)).toString("base64");
    return `session=${encoded}`;
}

async function runTests() {
    console.log("Starting Forum API Integration Tests...");
    let testCount = 0;
    let passCount = 0;

    function assert(condition, message) {
        testCount++;
        if (condition) {
            passCount++;
            console.log(`✅ PASS: ${message}`);
        } else {
            console.error(`❌ FAIL: ${message}`);
        }
    }

    try {
        // ----------------------------------------------------
        // TEST 1: POST CREATION (APPROVED)
        // ----------------------------------------------------
        console.log("\n--- Test 1: Create normal post (Approved) ---");
        const createPostRes = await fetch(`${BASE_URL}/api/forum/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(student1),
            },
            body: JSON.stringify({
                title: "Thảo luận về định lý Fermat",
                content:
                    "Chứng minh định lý Fermat lớn cho trường hợp n = 3: $x^3 + y^3 = z^3$. Ai có tài liệu hay không?",
                anonymous: false,
            }),
        });

        assert(createPostRes.ok, "Create post HTTP status is OK");
        const postData = await createPostRes.json();
        assert(postData.ok === true, "Response contains ok: true");
        assert(
            postData.postId !== undefined,
            `Post created with ID: ${postData.postId}`
        );
        assert(
            postData.moderationStatus === "approved",
            "Post status is approved"
        );
        const normalPostId = postData.postId;

        // ----------------------------------------------------
        // TEST 2: POST CREATION (BLOCKED due to banned word)
        // ----------------------------------------------------
        console.log(
            "\n--- Test 2: Create post with banned keywords (Blocked) ---"
        );
        const createBannedPostRes = await fetch(`${BASE_URL}/api/forum/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(student1),
            },
            body: JSON.stringify({
                title: "Chia sẻ link web sex cực hot",
                content: "Web sex hay nhất hiện nay, mọi người click xem nhé.",
                anonymous: true,
            }),
        });

        assert(createBannedPostRes.ok, "Create banned post HTTP status is OK");
        const bannedPostData = await createBannedPostRes.json();
        assert(
            bannedPostData.moderationStatus === "blocked",
            "Post status is blocked"
        );
        assert(
            bannedPostData.message.includes("bị chặn"),
            "Message informs about block"
        );

        // ----------------------------------------------------
        // TEST 3: POST CREATION (PENDING due to sensitive word)
        // ----------------------------------------------------
        console.log(
            "\n--- Test 3: Create post with sensitive keywords (Pending) ---"
        );
        const createSensitivePostRes = await fetch(
            `${BASE_URL}/api/forum/posts`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: getCookie(student1),
                },
                body: JSON.stringify({
                    title: "Có ai có đáp án thi không?",
                    content:
                        "Cho mình xin đáp án thi cuối kì 2 môn toán lớp 10 với.",
                    anonymous: false,
                }),
            }
        );

        assert(
            createSensitivePostRes.ok,
            "Create sensitive post HTTP status is OK"
        );
        const sensitivePostData = await createSensitivePostRes.json();
        assert(
            sensitivePostData.moderationStatus === "pending",
            "Post status is pending"
        );
        const pendingPostId = sensitivePostData.postId;

        // ----------------------------------------------------
        // TEST 4: POSTS LISTING (ROLE PREFERENCE)
        // ----------------------------------------------------
        console.log(
            "\n--- Test 4: Get posts list (Student 1 vs Student 2 vs Guest) ---"
        );
        // Student 1 (Author) should see the pending post
        const listS1Res = await fetch(`${BASE_URL}/api/forum/posts`, {
            headers: { Cookie: getCookie(student1) },
        });
        const listS1 = await listS1Res.json();
        const s1HasPending = listS1.items.some((p) => p.id === pendingPostId);
        assert(
            s1HasPending,
            "Author (Student 1) can see their own pending post"
        );

        // Student 2 should NOT see the pending post
        const listS2Res = await fetch(`${BASE_URL}/api/forum/posts`, {
            headers: { Cookie: getCookie(student2) },
        });
        const listS2 = await listS2Res.json();
        const s2HasPending = listS2.items.some((p) => p.id === pendingPostId);
        assert(
            !s2HasPending,
            "Other students (Student 2) cannot see pending posts"
        );

        // Guest should NOT see the pending post
        const listGuestRes = await fetch(`${BASE_URL}/api/forum/posts`);
        const listGuest = await listGuestRes.json();
        const guestHasPending = listGuest.items.some(
            (p) => p.id === pendingPostId
        );
        assert(!guestHasPending, "Guests cannot see pending posts");

        // ----------------------------------------------------
        // TEST 5: COMMENTS CREATION & REFRESH
        // ----------------------------------------------------
        console.log("\n--- Test 5: Add comments (Approved and Pending) ---");
        const createCommentRes = await fetch(
            `${BASE_URL}/api/forum/posts/${normalPostId}/comments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: getCookie(student2),
                },
                body: JSON.stringify({
                    content:
                        "Tôi có cách chứng minh bằng cách xét mô-đun dư $x^3 \\equiv y^3 \\pmod 9$.",
                    anonymous: false,
                }),
            }
        );
        assert(createCommentRes.ok, "Create comment HTTP status is OK");
        const commentData = await createCommentRes.json();
        assert(commentData.ok === true, "Comment response has ok: true");
        assert(
            commentData.moderationStatus === "approved",
            "Comment is approved"
        );
        const approvedCommentId = commentData.commentId;

        // Add nested comment
        const createNestedRes = await fetch(
            `${BASE_URL}/api/forum/posts/${normalPostId}/comments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: getCookie(student1),
                },
                body: JSON.stringify({
                    parentCommentId: approvedCommentId,
                    content: "Đúng vậy, cách này rất chuẩn!",
                    anonymous: true,
                }),
            }
        );
        assert(createNestedRes.ok, "Create nested comment HTTP status is OK");
        const nestedData = await createNestedRes.json();
        assert(nestedData.ok === true, "Nested comment response has ok: true");

        // Add sensitive comment
        const createSensitiveCommentRes = await fetch(
            `${BASE_URL}/api/forum/posts/${normalPostId}/comments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: getCookie(student2),
                },
                body: JSON.stringify({
                    content: "Lần thi sau tớ định quay cóp đề thi thôi.",
                    anonymous: false,
                }),
            }
        );
        const sensitiveCommentData = await createSensitiveCommentRes.json();
        assert(
            sensitiveCommentData.moderationStatus === "pending",
            "Sensitive comment status is pending"
        );
        const pendingCommentId = sensitiveCommentData.commentId;

        // ----------------------------------------------------
        // TEST 6: POST DETAILS & COMMENTS FETCHING
        // ----------------------------------------------------
        console.log("\n--- Test 6: Get post details & check comments tree ---");
        const postDetailsRes = await fetch(
            `${BASE_URL}/api/forum/posts/${normalPostId}`,
            {
                headers: { Cookie: getCookie(student1) },
            }
        );
        assert(postDetailsRes.ok, "Fetch post details HTTP status is OK");
        const details = await postDetailsRes.json();
        assert(details.post.id === normalPostId, "Post ID matches");

        // Check anonymity: author of nested comment is student 1 but anonymous = true
        const nestedComment = details.comments.find(
            (c) => c.parentCommentId === approvedCommentId
        );
        assert(nestedComment !== undefined, "Nested comment fetched");
        assert(
            nestedComment.authorName === "Nguyễn Văn A",
            "Author themselves can see their real name on their anonymous comment"
        );

        // Fetch as Student 2 (should see "Học sinh ẩn danh")
        const postDetailsS2Res = await fetch(
            `${BASE_URL}/api/forum/posts/${normalPostId}`,
            {
                headers: { Cookie: getCookie(student2) },
            }
        );
        const detailsS2 = await postDetailsS2Res.json();
        const nestedCommentS2 = detailsS2.comments.find(
            (c) => c.parentCommentId === approvedCommentId
        );
        assert(
            nestedCommentS2.authorName === "Học sinh ẩn danh",
            'Other students see "Học sinh ẩn danh" for anonymous comments'
        );

        // ----------------------------------------------------
        // TEST 7: VOTES SYSTEM
        // ----------------------------------------------------
        console.log("\n--- Test 7: Upvote/Downvote Toggles (Idempotency) ---");
        // 7a. Upvote first time
        const vote1Res = await fetch(`${BASE_URL}/api/forum/votes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(student1),
            },
            body: JSON.stringify({
                targetType: "post",
                targetId: normalPostId,
                value: "up",
            }),
        });
        const vote1 = await vote1Res.json();
        assert(
            vote1.ok === true && vote1.newScore === 1 && vote1.userVote === 1,
            "Upvote creates +1 score and sets userVote = 1"
        );

        // 7b. Click upvote again -> retracts vote
        const vote2Res = await fetch(`${BASE_URL}/api/forum/votes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(student1),
            },
            body: JSON.stringify({
                targetType: "post",
                targetId: normalPostId,
                value: "up",
            }),
        });
        const vote2 = await vote2Res.json();
        assert(
            vote2.ok === true && vote2.newScore === 0 && vote2.userVote === 0,
            "Clicking upvote again retracts vote (score 0, userVote = 0)"
        );

        // 7c. Downvote
        const vote3Res = await fetch(`${BASE_URL}/api/forum/votes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(student1),
            },
            body: JSON.stringify({
                targetType: "post",
                targetId: normalPostId,
                value: "down",
            }),
        });
        const vote3 = await vote3Res.json();
        assert(
            vote3.ok === true && vote3.newScore === -1 && vote3.userVote === -1,
            "Downvote sets score to -1 and userVote = -1"
        );

        // 7d. Change direction to Upvote
        const vote4Res = await fetch(`${BASE_URL}/api/forum/votes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(student1),
            },
            body: JSON.stringify({
                targetType: "post",
                targetId: normalPostId,
                value: "up",
            }),
        });
        const vote4 = await vote4Res.json();
        assert(
            vote4.ok === true && vote4.newScore === 1 && vote4.userVote === 1,
            "Changing downvote to upvote changes score by +2 (score 1, userVote = 1)"
        );

        // ----------------------------------------------------
        // TEST 8: BEST ANSWER SYSTEM
        // ----------------------------------------------------
        console.log("\n--- Test 8: Mark/Toggle Best Answer ---");
        const bestAnswerRes = await fetch(
            `${BASE_URL}/api/forum/posts/${normalPostId}/best-answer`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: getCookie(student1), // Author
                },
                body: JSON.stringify({ commentId: approvedCommentId }),
            }
        );
        assert(bestAnswerRes.ok, "Best answer HTTP status is OK");
        const bestAnswerData = await bestAnswerRes.json();
        assert(bestAnswerData.isBestAnswer === true, "Best answer is set");
        assert(
            bestAnswerData.bestAnswer.acceptedBy === "author",
            "Accepted by author"
        );

        // ----------------------------------------------------
        // TEST 9: REPORTING & DEDUPLICATION & AUTO-PENDING
        // ----------------------------------------------------
        console.log(
            "\n--- Test 9: Report content & Deduplication & Auto-hide ---"
        );
        // 9a. Student 2 reports normal post
        const report1Res = await fetch(`${BASE_URL}/api/forum/reports`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(student2),
            },
            body: JSON.stringify({
                targetType: "post",
                targetId: normalPostId,
                reason: "spam",
                details: "Spam nhảm nhí quá!",
            }),
        });
        assert(report1Res.ok, "Report HTTP status is OK");
        const report1 = await report1Res.json();
        assert(report1.ok === true, "Report 1 successful");
        assert(report1.reportCount === 1, "Report count is 1");

        // 9b. Student 2 reports again -> should fail due to deduplication
        const report2Res = await fetch(`${BASE_URL}/api/forum/reports`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(student2),
            },
            body: JSON.stringify({
                targetType: "post",
                targetId: normalPostId,
                reason: "spam",
            }),
        });
        assert(!report2Res.ok, "Duplicate report fails (HTTP error)");
        const report2 = await report2Res.json();
        assert(
            report2.error.includes("đã gửi báo cáo"),
            "Informs user of duplicate report"
        );

        // 9c. Create 2 more dummy students to report the post, making reportCount >= 3
        const dummyS1 = {
            userId: "dummy_s1",
            email: "d1@zenith.edu.vn",
            name: "Dummy 1",
            role: "student",
        };
        const dummyS2 = {
            userId: "dummy_s2",
            email: "d2@zenith.edu.vn",
            name: "Dummy 2",
            role: "student",
        };

        await fetch(`${BASE_URL}/api/forum/reports`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(dummyS1),
            },
            body: JSON.stringify({
                targetType: "post",
                targetId: normalPostId,
                reason: "harassment",
            }),
        });

        const report3Res = await fetch(`${BASE_URL}/api/forum/reports`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: getCookie(dummyS2),
            },
            body: JSON.stringify({
                targetType: "post",
                targetId: normalPostId,
                reason: "other",
                details: "Báo cáo thứ 3",
            }),
        });
        const report3 = await report3Res.json();
        assert(
            report3.statusChanged === true,
            "Post moderation status automatically changed to pending due to reportCount >= 3"
        );
        assert(
            report3.message.includes("tạm ẩn"),
            "Message informs about post being hidden"
        );

        // ----------------------------------------------------
        // TEST 10: MODERATION QUEUE & RESOLVING ACTIONS
        // ----------------------------------------------------
        console.log(
            "\n--- Test 10: Teacher accesses Moderation Queue & Resolves ---"
        );
        // 10a. Fetch queue as teacher
        const queueRes = await fetch(
            `${BASE_URL}/api/forum/moderation/resolve`,
            {
                headers: { Cookie: getCookie(teacher) },
            }
        );
        assert(queueRes.ok, "Moderation queue fetched successfully");
        const queue = await queueRes.json();

        // The queue should contain the pending normal post (from reports), the sensitive pending post, and the pending comment
        const hasNormalPostInQueue = queue.posts.some(
            (p) => p.id === normalPostId
        );
        const hasPendingPostInQueue = queue.posts.some(
            (p) => p.id === pendingPostId
        );
        const hasPendingCommentInQueue = queue.comments.some(
            (c) => c.id === pendingCommentId
        );
        const hasOpenReportsInQueue = queue.reports.some(
            (r) => r.targetId === normalPostId
        );

        assert(hasNormalPostInQueue, "Reported post is in moderation queue");
        assert(
            hasPendingPostInQueue,
            "Pending sensitive post is in moderation queue"
        );
        assert(
            hasPendingCommentInQueue,
            "Pending sensitive comment is in moderation queue"
        );
        assert(
            hasOpenReportsInQueue,
            "Open reports list is in moderation queue"
        );

        // 10b. Teacher approves the reported post (keeping it approved)
        const resolvePostRes = await fetch(
            `${BASE_URL}/api/forum/moderation/resolve`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: getCookie(teacher),
                },
                body: JSON.stringify({
                    targetType: "post",
                    targetId: normalPostId,
                    action: "approve",
                    reason: "Nội dung lành mạnh, thảo luận tốt.",
                }),
            }
        );
        assert(resolvePostRes.ok, "Resolve post HTTP status is OK");
        const resolvePost = await resolvePostRes.json();
        assert(resolvePost.action === "approved", "Post approved successfully");

        // Check that reports on it are resolved/dismissed (should not be in queue anymore)
        const queueRes2 = await fetch(
            `${BASE_URL}/api/forum/moderation/resolve`,
            {
                headers: { Cookie: getCookie(teacher) },
            }
        );
        const queue2 = await queueRes2.json();
        const reportsForNormalPost = queue2.reports.filter(
            (r) => r.targetId === normalPostId
        );
        assert(
            reportsForNormalPost.length === 0,
            "Reports for resolved post are cleared from open queue"
        );

        // 10c. Teacher blocks the pending comment
        const resolveCommentRes = await fetch(
            `${BASE_URL}/api/forum/moderation/resolve`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: getCookie(teacher),
                },
                body: JSON.stringify({
                    targetType: "comment",
                    targetId: pendingCommentId,
                    action: "block",
                    reason: "Không thảo luận về hành vi gian lận thi cử.",
                }),
            }
        );
        assert(resolveCommentRes.ok, "Resolve comment HTTP status is OK");
        const resolveComment = await resolveCommentRes.json();
        assert(
            resolveComment.action === "blocked",
            "Comment blocked successfully"
        );

        console.log(`\n======================================================`);
        console.log(
            `TEST RESULTS: Passed ${passCount} / ${testCount} assertions.`
        );
        console.log(`======================================================`);

        if (passCount === testCount) {
            console.log(
                "🎉 ALL TESTS PASSED SUCCESSFULLY! The Forum API is fully functional."
            );
            process.exit(0);
        } else {
            console.error("❌ SOME TESTS FAILED.");
            process.exit(1);
        }
    } catch (err) {
        console.error("Test execution failed with error:", err);
        process.exit(1);
    }
}

runTests();
