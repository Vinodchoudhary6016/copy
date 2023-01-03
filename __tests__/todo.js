const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suite", function () {
    beforeAll(async () => {
          await db.sequelize.sync({ force: true });
          server = app.listen(4000, () => { });
          agent = request.agent(server);
        });

        afterAll(async () => {
            try {
                await db.sequelize.close();
                await server.close();
            } catch (error) {
                console.log(error);
            }
        });

        test("Create a todo and responds with json at /todos POST end point", async () => {
            const response = await agent.post("/todos").send({
                tittle: "Buy milk",
                dueDate: new Date().toISOString(),
                completed: false,
            });
            expect(response.statusCode).toBe(200);
            expect(response.header["content-type"]).toBe(
                "application/json; charset=utf-8"
            );
            const parsedResponse = JSON.parse(response.text);
            expect(parsedResponse.id).toBeDefined();
        });

        test("Marks a todo with the given ID as complete", async () => {
            const response = await agent.post("/todos").send({
                tittle: "Buy milk",
                dueDate: new Date().toISOString(),
                completed: false,
            });
            const parsedResponse = JSON.parse(response.text);
            const todoID = parsedResponse.id;
            expect(parsedResponse.completed).toBe(false);
            
            const markCompleteResponse = await agent
            .put(`/todos/${todoID}/markASCompleted`)
            .send();
            const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
            expect(parsedUpdateResponse.completed).toBe(true);
        });

        test("Fetches all todos in the database using /todos endpoint", async () => {
            await agent.post("/todos").send({
              tittle: "Buy xbox",
              dueDate: new Date().toISOString(),
              completed: false,
            });
            await agent.post("/todos").send({
              tittle: "Buy ps3",
              dueDate: new Date().toISOString(),
              completed: false,
            });
            const response = await agent.get("/todos");
            const parsedResponse = JSON.parse(response.text);
            
            expect(parsedResponse.length).toBe(4);
            expect(parsedResponse[3]["tittle"]).toBe("Buy ps3");
          });
    
        test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
         const response = await agent.post("/todos").send({
          tittle: "Dont know todo",
          dueDate: new Date().toISOString(),
          completed: false,
      });
      
        const parsedResponse = JSON.parse(response.text);
        const todoID = parsedResponse.id;
         

        const markCompleteResponse = await agent.put(`/todos/${todoID}/markASCompleted`).send();
        const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
        expect(parsedUpdateResponse.completed).toBe(true);
        });
    });