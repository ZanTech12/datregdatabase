// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        middleName: String,
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dateOfBirth: Date,
        nationality: String,
        stateOfOrigin: String,
        lga: String,
        homeAddress: String,
        religion: String,
        classLevel: { type: String, required: true },
        section: String,
        session: String,
        term: String,
        previousSchool: String,
        dateOfAdmission: Date,
        admissionNumber: { type: String, unique: true, required: true },
        passport: String,
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
