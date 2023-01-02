const express = require ('express');
const app = express();
const { Todo } = require("./models");
const bodyPaser = require('body-parser');
app.use(bodyPaser.json());

app.get("/", function ( request, response) {
    response.send("Hello world");
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  const todos = await Todo.findAll()
  return response.send(todos)
    
});

app.get("/todos/:id", async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
});

app.post("/todos", async ( request, response) => {
 try {
   const todo = await Todo.addTodo(request.body);
   return response.json(todo)
 } catch (error) {
   console.log(error);
   return response.status(422).json(error);
 }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
    const todo = await Todo.findByPk(request.params.id);
    try {
        const updatedTodo = await todo.markAscompleted()
        return response.json(updatedTodo);
    }   catch (error) {
        console.log(error);
        return response.status(422).json(error);   
    }
});

app.delete("/todos/:id", async (request, response) => {
    console.log("Delete a todo by ID:", request.params.id);

    const deleteTodo = await Todo.destroy({where:{id:request.params.id}})
    return response.send(deleteTodo ? true : false)

});

module.exports = app;