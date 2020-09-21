const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dateSchema = new Schema({
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

const courseSchema = new Schema({
    bundle_id: {
        type: String,
        required: true
    },
    course_type: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    min_age: {
        type: Number,
        required: true
    },
    max_age: {
        type: Number,
        required: true
    },
    accommodation_details: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration_days: {
        type: Number,
        required: true
    },
    course_link: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: false
    },
    dates: [dateSchema]
}, { timestamps: true });

const courseModel = mongoose.model('courses', courseSchema);

module.exports = courseModel;