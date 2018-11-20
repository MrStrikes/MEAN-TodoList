angular.module('TaskServices', []).factory('Task', function($http) {
    let taskFactory = {};

    taskFactory.addTask = taskDatas => {
        return $http.post('/api/addTask', taskDatas);
    };

    taskFactory.getTasks = () => {
        return $http.post('/api/getTasks');
    };

    taskFactory.deleteTask = id => {
        return $http.post('/api/delTask', id);
    };

    taskFactory.changeTaskState = datas => {
        return $http.put('/api/updateState', datas);
    };

    return taskFactory;
});