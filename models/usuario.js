module.exports = () => {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const schema =  Schema({ 
        nmUsuario: {type: String, required: true },
        sobrenomeUsuario: {type: String, required: true},
        dsSenha: {type: String, required: true},
        nrCPF: {type: String, unique: true, required: true },
        dsEmail: {type: String, required: true}                            
    });

    return mongoose.model('Usuario', schema);
}   