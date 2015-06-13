var Notifications = (function(Handlebars) {
  var DEFAULT_TIMEOUT = 3000;
  var notificationId  = 0;

  function Notifications($el, templateContent) {
    this.$el = $el;
    this.template = Handlebars.compile(templateContent);
  }

  Notifications.prototype.add = function(notice) {
    var id = generateId();
    this.$el.append(this.template({ id: id, notice: notice }));

    setTimeout(function() { this.remove(id); }.bind(this), DEFAULT_TIMEOUT);

    return id;
  };

  Notifications.prototype.remove = function(id) {
    this.$el.find('[data-id="'+id+'"]').remove();
  };

  function generateId() {
    return notificationId += 1;
  }

  return Notifications;
}(window.Handlebars));

var TodoList = (function(Handlebars) {
  function TodoList($el, templateContent) {
    this.$el = $el;
    this.template = Handlebars.compile(templateContent);
  }

  TodoList.prototype.add = function(todo) {
    this.$el.append(this.template(todo));
  };

  TodoList.prototype.remove = function(id) {
    var $todo = this.$el.find('.todo[data-id="'+id+'"]');

    $todo.fadeToggle(function() {
      $todo.remove();
    });
  };

  return TodoList;
}(window.Handlebars));

$(function() {
  var notifications  = new Notifications($('.js-notifications'), $('#notification-tpl').html());
  var todos          = new TodoList($('.js-todos'), $('#todo-tpl').html());
  var $form          = $('.js-form');
  var $input         = $('#todo-input');

  $input.focus();

  $form.on('submit', function(e) {
    e.preventDefault();

    $.ajax({
      url: '/todos',
      type: 'post',
      data: { task: $input.val() },
      dataType: 'json',
      success: function(data) {
        todos.add(data);
        notifications.add('Successfully added todo: "'+data.task+'"');

        $form[0].reset();
        $input.focus();
      }
    });
  });

  todos.$el.on('click', '.js-destroy', function(e) {
    e.preventDefault();
    var $todo = $(e.target).closest('.todo');
    var id = $todo.data('id');

    $.ajax({
      url: '/todos/'+id,
      type: 'delete',
      success: function() {
        notifications.add('Successfully removed todo: "'+$todo.find('span').html()+'"');
        todos.remove(id);

        $input.focus();
      }
    });
  });
});
