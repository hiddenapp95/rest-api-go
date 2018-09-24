var mongoose = require('mongoose');
const mongoDbUlr = 'mongodb://localhost/Ieric';

const connectToDatabase = () =>
    mongoose.connect(mongoDbUlr,{useNewUrlParser:true})
        .catch(error=>setTimeout(connectToDatabase,5000));


connectToDatabase();