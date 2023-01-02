/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { request, response } = require('express')
const express = require ('express')
const app = express()
const bodyPaser = require('body-parser')
app.use(bodyPaser.json());

const { Todo } = require("./models");
const todo = require('./models/todo');

app.get( "/todos",( request, response) => {
    console.log("Todo list")
})

app.post("/todos", async ( request, response) => {
    console.log("Creating a todo", request.body)
try {
   const todo = await Todo.addTodo({ tittle: request.body.tittle, dueDate: request.body.dueDate, completed: false })
   return response.json(todo)
 } catch (error) {
    console.log(error)
    return response.status(422).json(error)
 }
})

//PUT http://mytodoapp.com/todos/123/markAsCompeleted
app.put("/todos/:id/markAsCompleted", async (request, response) => {
    console.log("We have to update a todo with ID:", request.params.id)
    const todo = await Todo.findByPk(request.params.id)
    try {
        const updatedTodo = await todo.markAscompleted()
        return response.json(updatedTodo)
    } catch (error) {
        console.log(error)
    return response.status(422).json(error)   
    }
    
})

app.delete("/todos/:id", (request, response) => {
    console.log("Delete a todo by ID:", request.params.id)
})

module.exports = app;