class Todo
  attr_reader :id, :task, :created_at

  def initialize(id:, task:, created_at: Time.now)
    @id = id
    @task = task
    @created_at = created_at
  end

  def to_h
    {
      id: id,
      task: task,
      created_at: created_at
    }
  end
end
