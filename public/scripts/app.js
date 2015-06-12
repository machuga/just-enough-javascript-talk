$(function() {
  $('#todo-input').focus();

  $('.js-form').on('submit', function(e) {
    e.preventDefault();

    $.ajax({
      url: '/todos',
      type: 'post',
      data: { task: $('.js-form #todo-input').val() },
      dataType: 'json',
      success: function(data) {
        $('.todos').append('<article class="todo" data-id="'+data.id+'">' +
                           '<button type="button" class="js-destroy">&times;</button> ' +
                           '<span>'+data.task+'</span></article>');
        $('.js-notifications').append('<p>Successfully added todo: "'+data.task+'"</p>');

        setTimeout(function() {
          $('.js-notifications').html('');
        }, 3000);

        $('.js-form')[0].reset();
        $('#todo-input').focus();
      }
    });
  });

  $('.todos').on('click', '.js-destroy', function(e) {
    e.preventDefault();

    $.ajax({
      url: '/todos/'+$(this).closest('.todo').data('id'),
      type: 'delete',
      success: function() {
        var id = $(e.target).closest('.todo').data('id');
        $('.js-notifications').append('<p data-id="'+$(e.target).closest('.todo').data('id')+'">Successfully removed todo: "'+$(e.target).closest('.todo').find('span').html()+'"</p>');
        $(e.target).closest('.todo').slideUp(function() {
          $(e.target).closest('.todo').remove();
        });

        setTimeout(function() {
          $('.js-notifications').find('p[data-id="'+id+'"]').remove();
        }, 3000);

        $('#todo-input').focus();
      }
    });
  });
});
