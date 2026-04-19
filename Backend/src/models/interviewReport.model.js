const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [true, "Technical question is required"]
    },
    intention : {
        type : String,
        required : [true, "Intention is required"]
    },
    
    answer : {
        type: String,
        required : [true, "Answer is required"]
    },
    
}, {
    _id : false
})
const behavioralQuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [true, "Behavioral question is required"]
    },
    intention : {
        type : String,
        required : [true, "Intention is required"]
    },
    
    answer : {
        type: String,
        required : [true, "Answer is required"]
    },
    
}, {
    _id : false
})

const skillGapSchema = new mongoose.Schema({
    skill : {
        type : String,
        required : [true, "Skill is required"]
    },
    severity : {
        type : String,
        enum : ["low", "medium", "high"],
        required : [true, "Severity is required"]
    },
    reason : {
        type : String,
        required : [true, "Reason is required"]
    }
}, {
    _id : false
})

const preparationSuggestionSchema = new mongoose.Schema({
    day: {
        type : Number,
        required : [true, "Day is required"]
    },
    focus: {
        type : String,
        required : [true, "Focus is required"]
    },
    tasks : {
        type : [String],
        required : [true, "Tasks is required"]
    }
}, {
    _id : false
})


const interviewReportSchema = new mongoose.Schema({
        jobDescription : {
            type : String,
            required : [true, "Job description is required"]
        },
        resume: {
            type : String,
            required : [true, "Resume is required"]
        },
        selfDescription: {
            type : String,
        },
        matchScore : {
            type : Number,
            min : 0,
            max : 100,
        },
        technicalQuestions : [technicalQuestionSchema],
        behavioralQuestions : [behavioralQuestionSchema],
        skillGaps : [skillGapSchema],
        preparationSuggestions : [preparationSuggestionSchema],
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        }
    },
    {
        title : {
            type : String,
            required : [true, "Job Title is required"]
        }
    },
     {
        timestamps : true
    }
)

const interviewReportModel = mongoose.model("interviewReports", interviewReportSchema)

module.exports = interviewReportModel;