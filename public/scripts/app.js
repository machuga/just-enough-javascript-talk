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

$(function() {
  var notifications  = new Notifications($('.js-notifications'), $('#notification-tpl').html());
  var $todos         = $('.js-todos');
  var $form          = $('.js-form');
  var $input         = $('#todo-input');
  var todoTpl        = Handlebars.compile($('#todo-tpl').html());

  $input.focus();

  $form.on('submit', function(e) {
    e.preventDefault();

    $.ajax({
      url: '/todos',
      type: 'post',
      data: { task: $input.val() },
      dataType: 'json',
      success: function(data) {
        $todos.append(todoTpl(data));
        notifications.add('Successfully added todo: "'+data.task+'"');

        $form[0].reset();
        $input.focus();
      }
    });
  });

  $todos.on('click', '.js-destroy', function(e) {
    e.preventDefault();
    var $todo = $(e.target).closest('.todo');
    var id = $todo.data('id');

    $.ajax({
      url: '/todos/'+id,
      type: 'delete',
      success: function() {
        notifications.add('Successfully removed todo: "'+$todo.find('span').html()+'"');

        $todo.fadeToggle(function() {
          $(this).remove();
        });

        $input.focus();
      }
    });
  });
});
