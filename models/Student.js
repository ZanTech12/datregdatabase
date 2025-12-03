import mongoose from 'mongoose';

// Define the schema for a Student
const studentSchema = new mongoose.Schema({
    // Required fields with validation
    firstName: {
        type: String,
        required: [true, 'First name is required.'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.'],
        trim: true
    },
    gender: {
        type: String,
        required: [true, 'Gender is required.'],
        enum: {
            values: ['Male', 'Female'],
            message: 'Gender must be either Male or Female.'
        }
    },
    classLevel: {
        type: String,
        required: [true, 'Class level is required.'],
        enum: {
            values: [
                "Reception", "KG 1", "KG 2", "Nursery 1", "Nursery 2",
                "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
                "JSS 1", "JSS 2", "JSS 3",
                "SSS 1", "SSS 2", "SSS 3"
            ],
            message: 'Invalid class level provided.'
        }
    },

    // System-generated fields
    admissionNumber: {
        type: String,
        required: true,
        unique: true, // Ensures no two students have the same admission number
        trim: true
    },

    // Optional fields
    passport: {
        type: String, // Stores the filename of the uploaded image
        trim: true
    },

    // Soft delete flag
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true
});

// **CRITICAL STEP**: Create the Mongoose model from the schema
// The first argument 'Student' is the singular name of the collection.
// Mongoose will automatically look for the plural 'students' collection in the database.
const Student = mongoose.model('Student', studentSchema);

// **CRITICAL STEP**: Export the model as the default export
// This allows `import Student from ...` to work in your routes file.
export default Student;