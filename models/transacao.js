module.exports = () => {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    
    const transacao = Schema({
        tpTransacao: {type: String, enum: ["debito", "credito"]},
        vlTransacao: {type: Number},
        dtTransacao: {type: Date, default: Date.now},
        contaRef: {type: Number},
        agenciaRef: {type: Number},
        observacao: {type: String},
        vlAnterior: {type: Number},
        vlAtual: {type: Number} 
    })

    return mongoose.model('Transacao', transacao);
}   