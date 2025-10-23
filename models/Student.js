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
        homeAddress: { type: String, required: true },
        religion: {
            type: String,
            enum: ["Christianity", "Islam", "Other"],
            default: "Christianity",
        },

        // ✅ Class levels now include Reception
        classLevel: {
            type: String,
            required: true,
            enum: [
                "Reception",
                "KG 1",
                "KG 2",
                "Nursery 1",
                "Nursery 2",
                "Primary 1",
                "Primary 2",
                "Primary 3",
                "Primary 4",
                "Primary 5",
                "Primary 6",
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

        // ✅ Allow term to be optional to avoid validation error
        term: {
            type: String,
            enum: ["First Term", "Second Term", "Third Term", ""],
            default: "",
        },

        previousSchool: { type: String },
        dateOfAdmission: { type: Date },

        // ✅ Auto-generate admissionNumber if not provided
        admissionNumber: {
            type: String,
            unique: true,
            required: true,
            default: function () {
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                return `ADM-${Date.now()}-${randomNum}`;
            },
        },

        // ✅ Passport image URL
        passport: { type: String },

        // ✅ Phone number field (matches your frontend)
        phone: { type: String },

        // ✅ Soft delete flag
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for faster searches
studentSchema.index({ lastName: 1, firstName: 1, classLevel: 1 });

const Student = mongoose.model("Student", studentSchema);
export default Student;
