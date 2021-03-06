function saveTodo(todos, callback) {
    if (typeof (callback) !== 'function')
        callback = function () { };
    var selector_validator = getCredentials();
    if (selector_validator !== "") {
        var selector_validator_arr = selector_validator.split(":");
        var selector = selector_validator_arr[0];
        var validator = selector_validator_arr[1];
        var new_callback = function (success, result_text) {
            if (!success)
                localStorageFallback(callback);
            else {
                localStorageFallback(function () { });
                callback(success, result_text);
            }
        };
        save_todo_php(selector, validator, todoToString(todos), new_callback);
    }
    else {
        localStorageFallback(callback);
    }
    function localStorageFallback(callback) {
        if (typeof (Storage) !== undefined) {
            saveToLocalStorage(todos, "");
            callback(false, "saved to local storage, not logged in");
        }
        else {
            callback(false, 'local storage not supported. please create an account.');
        }
    }
}
function loadTodo(callback) {
    if (typeof (callback) !== 'function')
        callback = function () { };
    var selector_validator = getCredentials();
    if (selector_validator !== "") {
        var selector_validator_arr = selector_validator.split(":");
        var selector = selector_validator_arr[0];
        var validator = selector_validator_arr[1];
        var new_callback = function (username, todos, resultText) {
            if (username !== null) {
                callback(username, todos, resultText);
            }
            else {
                localStorageFallback(callback);
            }
        };
        load_username_todo_php(selector, validator, new_callback);
    }
    else {
        localStorageFallback(callback);
    }
    function localStorageFallback(callback) {
        if (typeof (Storage) !== undefined) {
            callback(null, loadFromLocalStorage(""), "loading from local memory");
        }
        else {
            callback(null, [], "please create an account! local memory not supported");
        }
    }
}
function saveToLocalStorage(todos, prefix) {
    try {
        localStorage.setItem(prefix + "num_todos", todos.length.toString());
        for (var i = 0; i < todos.length; i++) {
            localStorage.setItem(prefix + "todo-" + i, todos[i].createString());
            saveToLocalStorage(todos[i].subtasks, prefix + "todo-" + i);
        }
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
function loadFromLocalStorage(prefix) {
    var todos = [];
    try {
        var num_todos = parseInt(localStorage.getItem(prefix + "num_todos"));
        for (var i = 0; i < num_todos; i++) {
            var todo_string = localStorage.getItem(prefix + "todo-" + i);
            var todo = TodoItem.fromString(todo_string);
            todo.subtasks = loadFromLocalStorage(prefix + "todo-" + i);
            todos.push(todo);
        }
    }
    catch (err) {
        console.log(err);
    }
    return todos;
}
