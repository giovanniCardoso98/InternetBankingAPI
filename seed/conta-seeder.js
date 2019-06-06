const consign = require('consign')
const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const mongoHost = process.env.DBHOST || 'mongodb://localhost:27017/api-banking'
const app = express()

consign({})
  .include('models')
  .into(app)
;

const { Conta, usuario } = app.models

var mongoose = require('mongoose')

mongoose.connect(mongoHost)

novaConta("12312312312",1999,11955,123456789,3690.00)
novaConta("23423423423",1999,11956,234567890,1985.00)
novaConta("34534534534",1999,11955,345678901,5789.50)
novaConta("45645645645",1999,11957,456789012,918.30)
novaConta("56756756756",1999,11955,567890123,15983.90)
novaConta("67867867867",1999,11956,678901234,-55.20,true)

function novaConta(cpf,banco,agencia,conta,saldo,ultima){
    usuario.findOne({ nrCPF: cpf }).then(data => {
        var usuarioRetorno = data.toObject()
        let contaTemp = new Conta({
            usuario: usuarioRetorno._id,
            nrBanco: banco,
            nrAgencia: agencia,
            nrConta: conta,
            vlSaldo: saldo,
            favorecidos: []  
        })

        contaTemp.save(function(){
            if(ultima){
                exit()
            }
        })
    })
}

function exit(){
    mongoose.disconnect()
}