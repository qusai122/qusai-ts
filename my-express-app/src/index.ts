import express, {Request, Response, json} from 'express';
const {getData, getHTML} = require("../utils/filesystem");
import * as mysql from "mysql";


const app = express();
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
   password: "Root123",
   database: "db"
 });

 app.get("/db",(req,res)=>{
   console.log(pool)
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
   pool.query("SELECT * FROM users", (error, results: User[]) => {
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
 
 app.post('/users', async (req: Request, res: Response) => {
   
   try {
     const { first_name, last_name, email } = req.body;

     
     const query = 'INSERT INTO users (first_name, last_name) VALUES (?, ?, ?)';
     const result: mysql.Query = await pool.query(query, [first_name, last_name, email]);
     const responseData = {
      success : true,
      message : "User created successfully",
      record :{
         first_name: first_name,
         last_name: last_name,
         email: email

      }
     }
     res.json(responseData );

     
   } catch (error) {
     console.error('Error creating user:', error);
     res.status(500).json({ error: 'Error creating user' });
   }
 });
 

app.listen(3000, () => {
   console.log('Server is listening on port 3000');
});

//TODO:: Pagenation (Page number, Max limit)
//TODO:: Validation

