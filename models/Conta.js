module.exports = (app) => {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const favorecido = Schema({
        cpf: {type: String},
        conta: {type: String},
        agencia: {type: String},
        banco: {type: String},
        nome: {type: String}
    })

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

    const schema =  Schema({ 
        usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true},
        nrBanco: {type: Number, required: true},
        nrAgencia: {type: Number, required: true},
        nrConta: {type: Number, unique: true, required: true},
        vlSaldo: {type: Number, required: true},
        favorecidos: [favorecido],
        transacoes: [transacao]
    });

    return mongoose.model('Conta', schema);
}