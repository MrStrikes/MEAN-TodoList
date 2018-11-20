angular.module('TaskController', ['TaskServices']).controller('TaskControl', function(Task, $timeout) {
    let app = this;

    Task.getTasks()
    .then(data => {
        app.allDatas = data.data.tasks;
        if (app.allDatas == '') {
            app.allDatas = !app.allDatas;
        }
    });

    app.addTask = function(taskDatas) {
        Task.addTask(app.taskDatas);
    };

    app.deleteTask = id => {
        let toJSON = {id: id};
        Task.deleteTask(toJSON)
        .then(data => {
            if (data.data.status == "ok") {
                $timeout(() => {
                    window.location.reload();
                });
            }
        });
    };

    app.changeTaskState = (datas) => {
        Task.changeTaskState(datas)
        .then(data => {
            if (data.data.status == "ok") {
                $timeout(() => {
                    window.location.reload();
                });
            }
        });
    };
});