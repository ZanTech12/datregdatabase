import express from "express";
import Student from "../models/Student.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// === Multer Setup (with validation) ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else cb(new Error("Only .jpg, .jpeg, or .png images are allowed"));
    },
});

// === Register New Student ===
router.post("/register", upload.single("passport"), async (req, res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            gender,
            classLevel,
            dateOfBirth,
            nationality,
            stateOfOrigin,
            lga,
            homeAddress,
            religion,
            section,
            session,
            term,
            previousSchool,
            dateOfAdmission,
            phone,
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !gender || !classLevel) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Allowed options
        const allowedClasses = [
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
        ];
        const allowedGenders = ["Male", "Female"];
        const allowedTerms = ["First Term", "Second Term", "Third Term"];

        if (!allowedClasses.includes(classLevel))
            return res.status(400).json({ message: "Invalid class level" });
        if (!allowedGenders.includes(gender))
            return res.status(400).json({ message: "Invalid gender" });
        if (term && !allowedTerms.includes(term))
            return res.status(400).json({ message: "Invalid term" });

        // Generate unique admission number per year
        const year = new Date().getFullYear();
        const lastStudent = await Student.findOne({
            admissionNumber: { $regex: `^DIS/${year}/` },
        }).sort({ admissionNumber: -1 });

        let nextNumber = 1;
        if (lastStudent && lastStudent.admissionNumber) {
            const lastNum = parseInt(lastStudent.admissionNumber.split("/")[2], 10);
            nextNumber = lastNum + 1;
        }

        if (nextNumber > 999) {
            return res
                .status(400)
                .json({ message: "Maximum number of students for this year reached" });
        }

        const admissionNumber = `DIS/${year}/${String(nextNumber).padStart(3, "0")}`;

        // Create student record
        const student = new Student({
            firstName,
            middleName: middleName || "",
            lastName,
            gender,
            classLevel,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            nationality,
            stateOfOrigin,
            lga,
            homeAddress,
            religion,
            section,
            session,
            term: term || "", // ✅ allow empty term
            previousSchool,
            dateOfAdmission: dateOfAdmission ? new Date(dateOfAdmission) : null,
            phone, // ✅ renamed from phoneNumber
            admissionNumber,
            passport: req.file ? req.file.filename : null,
        });

        await student.save();
        res
            .status(201)
            .json({ message: "Student registered successfully", student });
    } catch (error) {
        console.error("❌ Error registering student:", error);
        res
            .status(500)
            .json({ message: "Error registering student", details: error.message });
    }
});

// === Get all non-deleted students ===
router.get("/", async (req, res) => {
    try {
        const students = await Student.find({ deleted: false });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Get deleted students (Recycle Bin) ===
router.get("/recyclebin", async (req, res) => {
    try {
        const deletedStudents = await Student.find({ deleted: true });
        res.json(deletedStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Restore a student ===
router.put("/restore/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { deleted: false },
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student restored", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Permanently delete student ===
router.delete("/permanent/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        if (student.passport) {
            const filePath = path.join("uploads", student.passport);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await student.deleteOne();
        res.json({ message: "Student permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Get single student ===
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Edit/Update student ===
router.put("/:id", upload.single("passport"), async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Update all fields from request body
        Object.keys(req.body).forEach((key) => {
            if (key === "dateOfBirth" || key === "dateOfAdmission") {
                student[key] = req.body[key] ? new Date(req.body[key]) : null;
            } else {
                student[key] = req.body[key];
            }
        });

        // Replace old passport if new one uploaded
        if (req.file) {
            if (student.passport) {
                const oldPath = path.join("uploads", student.passport);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            student.passport = req.file.filename;
        }

        await student.save();
        res.json({ message: "Student updated successfully", student });
    } catch (error) {
        console.error("❌ Error updating student:", error);
        res.status(500).json({ message: error.message });
    }
});

// === Soft delete (move to recycle bin) ===
router.put("/recycle/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { deleted: true },
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student moved to recycle bin", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
