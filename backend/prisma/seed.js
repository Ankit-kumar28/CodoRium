import "dotenv/config";
import { prisma } from "../src/config/database.js";
import { hashPassword } from "../src/utils/password.js";
async function main() {
    const email = "admin@gmail.com";
    const password = "admin@123";
    const passwordHash = await hashPassword(password);
    const existingAdmin = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (existingAdmin) {
        console.log("⚠️ Admin already exists");
        return;
    }
    const admin = await prisma.user.create({
        data: {
            firstName: "CodoRium",
            lastName: "Admin",
            email,
            passwordHash,
            status: "ACTIVE",
        },
    });
    await prisma.userRoleAssignment.create({
        data: {
            userId: admin.id,
            role: "ADMIN",
        },
    });
    console.log("✅ Admin created");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}
main()
    .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map