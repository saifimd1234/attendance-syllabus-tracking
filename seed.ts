import connect from "./lib/db";
import User from "./models/User";
import Student from "./models/Student";
import mongoose from "mongoose";

async function seed() {
    await connect();

    // Create Admin
    const adminEmail = "admin@system.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
        await User.create({
            email: adminEmail,
            password: "adminpassword123",
            admin: true
        });
        console.log("Admin created: " + adminEmail);
    }

    // Create a dummy student for testing auth
    const studentData = { name: "Test Student", class: "10A", school: "Global Academy" };
    let student = await Student.findOne({ name: studentData.name });
    if (!student) {
        student = await Student.create(studentData);
    }

    const studentEmail = "student@system.com";
    const existingStudentUser = await User.findOne({ email: studentEmail });
    if (!existingStudentUser) {
        await User.create({
            email: studentEmail,
            password: "studentpassword123",
            admin: false,
            studentId: student._id
        });
        console.log("Student User created: " + studentEmail);
    }

    console.log("Seed completed!");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
