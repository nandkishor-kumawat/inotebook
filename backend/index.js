const connetToMongo = require('./db');
const express = require('express');

connetToMongo()
const app = express();

const PORT = 5000;

app.use(express.json())

app.use('/api/auth/', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(PORT,()=>{
    console.log("server started at http://localhost:"+PORT)
})