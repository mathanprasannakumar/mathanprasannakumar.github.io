import express from 'express'
import chalk from 'chalk'
import path from 'path'


const __dirname = path.resolve();
const app = express()
const port = process.env.PORT || 3000

app.set("view engine","ejs")

app.use(express.json())
app.use(express.urlencoded({    
    extended:true,
}))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(__dirname));
// app.use(express.static('public/app/assets'));
// app.use(express.static('public/dist'));
// app.use(express.static('public/app/js'));

app.get('/',(req,res)=>
{
    res.render('main')
})
app.get('/home',(req,res)=>{
    res.render('main')
})
app.get('/home/project1',(req,res)=>
{
    res.render('sub1')
})

app.get('/home/project2',(req,res)=>
{
    res.render('sub2')
})

app.get('/home/project3',(req,res)=>
{
    res.render('sub3')
})
app.listen(port,()=>{
    console.log(chalk.green.bold(`The server is currently running on http://localhost:${port}\n`)+ " "+chalk.red.bold("\
    Press CTRL+C to exit the server"))
})