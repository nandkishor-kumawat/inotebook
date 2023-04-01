const mongoose = require('mongoose')
const mongoURI = 'mongodb://localhost:27017/inotebook'

const connetToMongo = ()=>{
    mongoose.connect(mongoURI)
}

module.exports = connetToMongo