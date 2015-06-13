$(function() {
  var $notifications = $('.js-notifications');
  var $todos         = $('.js-todos');
  var $form          = $('.js-form');
  var $input         = $('#todo-input');
  var todoTpl        = Handlebars.compile($('#todo-tpl').html());
  var noticeAddTpl   = Handlebars.compile($('#notice-add-tpl').html());
  var noticeRemTpl   = Handlebars.compile($('#notice-rem-tpl').html());

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
        $notifications.append(noticeAddTpl(data));

        setTimeout(function() {
          $notifications.find('p[data-id="'+data.id+'"]').remove();
        }, 3000);

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
        $notifications.append(noticeRemTpl({
          id: id,
          task: $todo.find('span').html()
        }));

        $todo.fadeToggle(function() {
          $(this).remove();
        });

        setTimeout(function() {
          $notifications.find('p[data-id="'+id+'"]').remove();
        }, 3000);

        $input.focus();
      }
    });
  });
});
