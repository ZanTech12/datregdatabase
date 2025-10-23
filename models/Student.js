// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        gender: { type: String, required: true, enum: ["Male", "Female"] },
        dateOfBirth: { type: Date },
        nationality: { type: String },
        stateOfOrigin: { type: String },
        lga: { type: String },
        homeAddress: { type: String },
        religion: { type: String, enum: ["Christianity", "Islam", "Other"], default: "Christianity" },

        // ✅ Updated: Expanded and validated class levels
        classLevel: {
            type: String,
            required: true,
            enum: [
                "KG 1",
                "KG 2",
                "Nursery 1",
                "Nursery 2",
                "Basic 1",
                "Basic 2",
                "Basic 3",
                "Basic 4",
                "Basic 5",
                "JSS 1",
                "JSS 2",
                "JSS 3",
                "SSS 1",
                "SSS 2",
                "SSS 3",
            ],
        },

        section: { type: String },
        session: { type: String },
        term: { type: String, enum: ["First Term", "Second Term", "Third Term"] },
        previousSchool: { type: String },
        dateOfAdmission: { type: Date },

        // Admission details
        admissionNumber: { type: String, unique: true, required: true },
        passport: { type: String },

        // ✅ New: Added phone number from RegisterStudent form
        phoneNumber: { type: String },

        // Soft delete flag
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Optional: Add index for faster search by name or class
studentSchema.index({ lastName: 1, firstName: 1, classLevel: 1 });

const Student = mongoose.model("Student", studentSchema);
export default Student;
