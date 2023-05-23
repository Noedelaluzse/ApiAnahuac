const mongoose = require('mongoose');

const dbConnection = async () => {

    mongoose.set("strictQuery", false);
    const DB_URI = process.env.DB_CNN;

    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, res) => {
        if(!err){
            console.log('**** CONEXION CORRECTA ****');
        }else{
            console.log('**** ERROR DE CONEXION CORRECTA ****');   
        }
    });
}
    module.exports = {
        dbConnection
    }