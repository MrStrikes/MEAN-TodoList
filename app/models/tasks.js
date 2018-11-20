const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TasksSchema = new Schema({
    taskCreator: {type: String, required: true},
    taskName: {type: String, required: true},
    taskDescription: {type: String, required: true},
    taskStatus: {type: String, required: true},
});

module.exports = mongoose.model('Tasks', TasksSchema);