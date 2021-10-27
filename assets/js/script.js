var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on("click","p", function() {
  //grab current elements text we clicked on
  var text = $(this).text().trim();
  //console log element
  console.log(text);
  //establish a variable that creates a textarea element with class = form-control and establish the value with existing value
  var textInput = $("<textarea>").addClass("form-control").val(text);
  //replace text with textInput added
  $(this).replaceWith(textInput);
  //focus browser on textarea element
  textInput.trigger("focus");
  //when user interacts with anything other than textarea
  $('.list-group').on("blur","textarea", function() {
    //get text that changed
    var text = $(this).val().trim();
    //get parent ULs ID attribute
    var status = $(this).closest(".list-group").attr("id").replace("list-", "");
    //get tasks position in the list of other li elements
    var index = $(this).closest(".list-group-item").index();
    //in the tasks object, find the matching status array and indexed item above and change text of it to text we just input
    tasks[status][index].text = text;
    //save tasks to localStorage
    saveTasks();
    //recreate <p>
    var taskP = $("<p>").addClass("m-1").text(text);
    //replace textarea with a p element
    $(this).replaceWith(taskP);
  })
});



// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


