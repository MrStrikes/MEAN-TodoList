const User = require('../models/user');
const Task = require('../models/tasks');
const jwt = require('jsonwebtoken');
const secret = 'jDFudiHMSJ';

module.exports = router => {
    router.post('/register', (req, res) => {
        const user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if (
            req.body.username == null || req.body.username == '' ||
            req.body.password == null || req.body.password == '' ||
            req.body.email == null || req.body.email == ''
        ) {
            const result = {
                status: 'failed',
                message: 'Did you really entered a username, a password or an email ?'
            };
            return res.send(result);
        } else {
            user.save(err => {
                if (err) return res.json({
                    status: 'failed',
                    message: 'Username or email already exists'
                });
                else return res.json({
                    status: 'ok',
                    message: 'User created'
                });
            });
        }
    });

    router.post('/login', (req, res) => {
        User.findOne({username: req.body.username})
        .select('username email password')
        .exec((err, user) => {
            if (err) throw err;

            if (!user) {
                res.json({
                    status: 'failed',
                    message: 'Couldn\'t auth the user'
                });
            } else if (user) {
                if (req.body.password){
                    let validPassword = user.comparePassword(req.body.password);
                    if (!validPassword){
                        res.json({
                            status: 'failed',
                            message: 'Couldn\'t auth the user'
                        });
                    } else {
                        let token = jwt.sign({
                            username: user.username,
                            email: user.email
                        }, secret, {
                            expiresIn: '24h'
                        });
                        res.json({
                            status: 'ok',
                            message: 'User authentificated',
                            token: token
                        });
                    }
                }
            }
        });
    });

    router.use((req, res, next) => {
        const token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) return res.json({status: 'failed', message: 'Token invalid'});
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({
                status: 'failed',
                message: 'No token found'
            });
        }
    });

    router.post('/me', (req, res) => {
        res.send(req.decoded);
    });

    router.post('/addTask', (req, res) => {
        const task = new Task();
        task.taskCreator = req.decoded.username;
        task.taskName = req.body.taskName;
        task.taskDescription = req.body.taskDescription;
        task.taskStatus = req.body.taskStatus;
        if (
            req.decoded.username == null || req.decoded.username == '' ||
            req.body.taskName == null || req.body.taskName == '' ||
            req.body.taskDescription == null || req.body.taskDescription == '' ||
            req.body.taskStatus == null || req.body.taskStatus == ''
        ) {
            const result = {
                status: 'failed',
                message: 'Did you entered a task or fulfilled it ?'
            };
            return res.send(result);
        } else {
            task.save(err => {
                if (err) return res.json({
                    status: 'failed',
                    message: 'An error occured during task creation'
                });
                else return res.json({
                    status: 'ok',
                    message: 'Task created'
                });
            });
        }
    });

    router.post('/getTasks', (req, res) => {
        Task.find({taskCreator: req.decoded.username})
        .select('taskCreator taskName taskDescription taskStatus')
        .exec((err, tasks) => {
            if (err) throw err;

            if (!tasks) {
                res.json({
                    status: 'failed',
                    message: 'Couldn\'t find any task'
                });
            } else if (tasks) {
                res.json({
                    status: 'ok',
                    message: 'Found tasks',
                    tasks: tasks
                });
            }
        });
    });

    router.post('/delTask', (req, res) => {
        Task.remove({
            _id: req.body.id
        }, (err, task) => {
            if (err) throw err;

            res.json({status: 'ok', message: 'Task deleted'});
        });
    });

    router.put('/updateState', (req, res) => {
        Task.findById({
            _id: req.body._id,
        }, (err, task) => {
            if (err) throw err;

            if (req.body) task.taskCreator = req.body.taskCreator;
            if (req.body) task.taskDescription = req.body.taskDescription;
            if (req.body) task.taskName = req.body.taskName;
            if (req.body.taskStatus == "todo") task.taskStatus = 'done';
            else if (req.body.taskStatus == "done") task.taskStatus = "todo";

            task.save(err => {
                if (err) throw err;

                res.json({ status: 'ok', message: 'Status updated', taskState: task.taskStatus });
            });
        });
    });

    return router;
};