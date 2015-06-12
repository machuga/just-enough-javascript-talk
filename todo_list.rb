require './todo'

class TodoList
  def initialize
    @id_counter = 0

    # Super persistent storage
    @todos = []

    # Seed the list
    add('Write talk')
    add('Give talk')
    add('Find more coffee')
  end

  # Add new todo - factory method
  def add(task)
    todo = Todo.new(id: generate_id, task: task)
    @todos << todo
    todo
  end

  def all
    @todos
  end

  def find(id)
    @todos.find { |todo| todo.id == id }
  end

  def delete(todo)
    @todos.delete(todo)
  end

  private

  def generate_id
    @id_counter += 1
  end
end
