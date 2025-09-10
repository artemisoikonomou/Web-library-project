import express from "express";
import ejs from "ejs";
import pg from "pg";
import bodyParser from "body-parser";
import env from "dotenv";
env.config(); 

const app =express();
const port=3000;

const db=new pg.Client({
    user:process.env.PG_USER,
    host:process.env.PG_HOST,
    database:process.env.PG_DATABASE,
    password:process.env.PG_PASSWORD,
    port:process.env.PG_PORT,
});

db.connect();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// WHEN WE FIRST LOT WE GET THE HOMEPAGE
app.get("/",async (req,res)=>{
    try{
        // WE GET EVERY INFORMATION THAT EXISTS IN THE books ΤABLE
        const result = await db.query("SELECT * FROM books");
        //AND SAVE THEM ON AN ARRAY THAT IS SEND BACK TO THE HOMEPAGE FOR USE
        let books=result.rows;
        res.render("library.ejs",{
            books:books,
        })

    }catch (error){
        console.log("ERROR",error)
    }
   
})

//GET THE ID FROM THE BOOK THAT WAS CHOOSEN THROUGHT THE LINK
app.get("/book-opinion",async (req,res)=>{
    //GET THE ID THAT WAS SEND THROUGHT THE URL 
    const result_id = req.query.id;

    try{
        //GET BACK EVERY INFORMATION FROM BOTH TABLES my_opinion AND books TO BE ADDED TO THE PAGE WITH THE MORE DETAILS
        const result = await db.query(
            "SELECT * FROM my_opinion INNER JOIN books ON my_opinion.book_id = books.id WHERE my_opinion.id = $1",
            [result_id]
        );
       
        //THIS IS USED TO GET ALL THE CODES THAT I HAVE THE SAME book_id WITH THE ID FROM THE TABLE books
        const result1 = await db.query(
            "SELECT * FROM quotes INNER JOIN books ON quotes.quotes_id = books.id WHERE books.id = $1",
            [result_id]
        );
        //SAVE THE RESULTS IN TWO ARRAYS AND SEND THEM BACK FOR USE
        let my_opinions=result.rows;
        let quotes=result1.rows;
        res.render("details.ejs",{
            my_opinions:my_opinions,
            quotes:quotes,
        })

    }catch (error){
        console.log("ERROR",error)
    }
})

//THIS IS USED WHEN A CATEGORY FROM THE DROPDOWN IS CHOOSEN
app.get("/categories", async (req, res) =>{

    //GET BACK THE name OF THE CATEGORY THAT WAS CHOSEN
    const chosen_category = req.query.name;

    try{
        // I WANT AS A RESULT ONLY THE INFORMATION FROM THE TABLE books
        const result = await db.query(
            "SELECT books.id, books.title, books.recomandation, books.summary, books.isbn FROM books INNER JOIN categories ON categories.book_id = books.id WHERE categories.name_of_category = $1", 
            [chosen_category]
        );
        //SAVE THE RESULT IN ARRAY THAT IS SEND BACK
        let books=result.rows;
        res.render("library.ejs",{
            books:books,
        })
    }catch(error){
        console.log("ERROR",error)
    }

})

app.listen(port,()=>{
    console.log(`Server listening to port, ${port}`)
})