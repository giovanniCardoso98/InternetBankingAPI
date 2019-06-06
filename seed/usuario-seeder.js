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

const { usuario } = app.models;

var mongoose = require('mongoose')

mongoose.connect(mongoHost)

novoUsuario("Andrey", "Lemos", "alemos123", "12312312312", "alemos@hotmail.com")
novoUsuario("Cynthia", "Mori", "cmori123", "23423423423", "cmori@hotmail.com")
novoUsuario("Dannyel", "Kayke", "dkayke123", "34534534534", "dkayke@hotmail.com")
novoUsuario("Giovanni", "Oliveira", "goliveira123", "45645645645", "goliveira@hotmail.com")
novoUsuario("Jéssica", "Costa", "jcosta123", "56756756756", "jcosta@hotmail.com")
novoUsuario("Jéssica", "Maria", "jmaria123", "67867867867", "jmaria@hotmail.com", true)

function novoUsuario(nome,sobrenome,senha,cpf,email,ultimo){
    let userTemp = new usuario({
        nmUsuario: nome,
        sobrenomeUsuario: sobrenome,
        dsSenha: bcrypt.hashSync(senha, 10),
        nrCPF: cpf,
        dsEmail: email      
    })

    userTemp.save(function(){
        if(ultimo){
            exit()
        }
    })
}

function exit(){
    mongoose.disconnect()
}