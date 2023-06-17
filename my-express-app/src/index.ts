import express, { Request, Response, json, NextFunction } from "express";
import Joi from "joi";

const { getData, getHTML } = require("../utils/filesystem");
import * as mysql from "mysql";

const app = express();
app.use(localhostMiddleware);
const userSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
});

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "pass123",
  //password: "Root123",
  database: "db",
});

app.get("/db", (req, res) => {
  console.log(pool);
});

/*app.get("/", (req, res)=>{
   const data = getData("../data/users.json");
   const formattedUsersList = data.map((user: User) => {
       return `<li>${user.id} ${user.first_name} ${user.last_name} </li>`
   }).join("")
   const html = getHTML("../static/html/page.html").replace('{{userList}}', formattedUsersList)
   res.send(html)
})*/

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

app.get("/db/users", (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error fetching users from database:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const users: User[] = results;
    // Process the fetched users as needed
    res.json(users);
  });
});

app.get("/books", (req, res) => {
  pool.query("SELECT * FROM books", (error: Error, results: User[]) => {
    if (error) {
      console.error("Error fetching users from database:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const users: User[] = results;
    // Process the fetched users as needed
    res.json(users);
  });
});

//************************************************************************ */
app.delete("/books", async (req: Request, res: Response) => {
  const isbn = req.query.isbn;

  pool.query("DELETE FROM books WHERE isbn=" + isbn + ";", (error, results) => {
    if (error) {
      console.error("Error fetching users from database:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Process the fetched users as needed
    console.log(results.affectedRows);
    console.log(results[1]);
    if (results.affectedRows) {
      res.json("The book is deleted!");
    } else {
      res.json("The book was not found!");
    }
  });
});

//************************************************************************ */

app.put("/books", async (req: Request, res: Response) => {
  const isbn = req.query.isbn;
  const name = req.query.name;
  const author = req.query.author;
  pool.query(
    "UPDATE books SET name='" +
      name +
      "' ,author='" +
      author +
      "' WHERE isbn =" +
      isbn +
      ";",
    (error, results) => {
      if (error) {
        console.error("Error fetching users from database:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Process the fetched users as needed
      console.log(results.affectedRows);
      if (results.affectedRows) {
        res.json("The book is updated!");
      } else {
        res.json("The book was not found!");
      }
    }
  );
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    //const { first_name, last_name, email } = req.body;

    const { error, value } = userSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    const { first_name, last_name, email } = value;

    const query = "INSERT INTO users (first_name, last_name) VALUES (?, ?, ?)";
    const result: mysql.Query = await pool.query(query, [
      first_name,
      last_name,
      email,
    ]);
    const responseData = {
      success: true,
      message: "User created successfully",
      record: {
        first_name: first_name,
        last_name: last_name,
        email: email,
      },
    };
    res.json(responseData);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

// Middleware function to check if the request comes from localhost
export function localhostMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const localhostIP = "::1"; // IPv6 representation of localhost
  console.log("localhostMiddleware");
  if (req.ip === localhostIP) {
    next();
  } else {
    res.status(403).json({ error: "Access denied" });
  }
}

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

//TODO:: Pagenation (Page number, Max limit)
//TODO:: Validation
