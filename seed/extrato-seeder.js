const consign = require('consign');
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoHost = process.env.DBHOST || 'mongodb://localhost:27017/api-banking';

const app = express();

consign({})
  .include('models')
  .into(app)
;

const { Conta, usuario } = app.models;

var mongoose = require('mongoose')

mongoose.connect(mongoHost)

novosExtratos("12312312312",
{
    tpTransacao: "debito",
    dtTransacao: "2018-12-09T18:19:21.541+0000",
    contaRef: 567890123,
    agenciaRef: 11955,
    vlTransacao: 500.00,
    vlAnterior: 4190.00,
    vlAtual:3690.00,
    observacao: "Emprestimo de novembro"
})

novosExtratos("56756756756",
{
    tpTransacao: "credito",
    dtTransacao: "2018-12-09T18:19:22.541+0000",
    contaRef: 123456789,
    agenciaRef: 11955,
    vlTransacao: 500.00,
    vlAnterior: 15483.90,
    vlAtual:15983.90,
    observacao: "Emprestimo de novembro"
})

novosExtratos("34534534534",
{
    tpTransacao: "debito",
    dtTransacao: "2018-12-09T18:22:34.541+0000",
    contaRef: 678901234,
    agenciaRef: 11956,
    vlTransacao: 1000.00,
    vlAnterior: 6789.50,
    vlAtual:5789.50,
    observacao: "Parcela do carro"
})

novosExtratos("67867867867",
{
    tpTransacao: "credito",
    dtTransacao: "2018-12-09T18:22:35.541+0000",
    contaRef: 345678901,
    agenciaRef: 11955,
    vlTransacao: 100.00,
    vlAnterior: -1055.20,
    vlAtual: -55.20,
    observacao: "Parcela do carro"
},true)

function novosExtratos(cpf,extrato,ultimo){
    usuario.findOne({ nrCPF: cpf }).then(data => {
        var usuarioRetorno = data.toObject();
        Conta.findOneAndUpdate({ usuario: usuarioRetorno._id }, {
            $push: {transacoes: extrato}
        }).then(dados =>{
            if(ultimo){
                exit()
            }
        })
    })
}

function exit(){
    mongoose.disconnect()
}