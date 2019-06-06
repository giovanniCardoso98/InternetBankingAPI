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

novosFavorecidos("12312312312",
    {
        "nome": "Jessica",
        "banco": "1999",
        "agencia": "11955",
        "conta": "567890123",
        "cpf": "56756756756"
    })

novosFavorecidos("23423423423",
    {
        "nome": "Dannyel",
        "banco": "1999",
        "agencia": "11955",
        "conta": "345678901",
        "cpf": "34534534534"
    })

novosFavorecidos("34534534534",
    {
        "nome": "Jessica",
        "banco": "1999",
        "agencia": "11956",
        "conta": "678901234",
        "cpf": "67867867867"
    })

novosFavorecidos("45645645645",
    {
        "nome": "Andrey",
        "banco": "1999",
        "agencia": "11955",
        "conta": "123456789",
        "cpf": "12312312312"
    })

novosFavorecidos("56756756756",
    {
        "nome": "Cynthia",
        "banco": "1999",
        "agencia": "11956",
        "conta": "234567890",
        "cpf": "23423423423"
    })

novosFavorecidos("67867867867",
    {
        "nome": "Giovanni",
        "banco": "1999",
        "agencia": "11957",
        "conta": "456789012",
        "cpf": "45645645645"
    },
    true)


function novosFavorecidos(cpf,favorecidos,ultimo){
    usuario.findOne({ nrCPF: cpf }).then(data => {
        var usuarioRetorno = data.toObject();
        Conta.findOneAndUpdate({ usuario: usuarioRetorno._id }, {
            $push: {favorecidos: favorecidos}
        }).then(dados => {
            if(ultimo){
                exit()
            }
        })
    })
}

function exit(){
    mongoose.disconnect()
}