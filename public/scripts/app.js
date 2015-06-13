$(function() {
  var $notifications = $('.js-notifications');
  var $todos         = $('.js-todos');
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
        $todos.append('<article class="todo" data-id="'+data.id+'">' +
                           '<button type="button" class="js-destroy">&times;</button> ' +
                           '<span>'+data.task+'</span></article>');
        $notifications.append('<p data-id="'+data.id+'">' +
                                      'Successfully added todo: "'+data.task +
                                      '"</p>');

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
        $notifications.append('<p data-id="' + id +
                                      '">Successfully removed todo: "' +
                                      $todo.find('span').html() +
                                      '"</p>');
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
