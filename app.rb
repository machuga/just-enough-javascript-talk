require 'sinatra'
require 'sinatra/json'
require 'sinatra/reloader'

require './todo_list'

list = TodoList.new

get '/' do
  todos = list.all
  erb :index, locals: { todos: todos }
end

post '/todos' do
  fail 'No task' if params[:task] == ''
  todo = list.add params[:task]

  status 201
  json todo.to_h
end

delete '/todos/:id' do
  todo = list.find params[:id].to_i
  fail Sinatra::NotFound unless todo

  list.delete todo

  status 204
end
