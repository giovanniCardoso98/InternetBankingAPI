const bcrypt = require('bcrypt');
var supertest = require('supertest')
var should = require('should')
var mongoHost = process.env.DBHOST || 'mongodb://localhost:27017/api-banking';

var server = supertest.agent('localhost:3000')

describe("Testes de usuário", function(){

    describe("Testes de login", function(){

        it("Tentativa de login válida", function(done){
            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "12312312312","senha": "alemos123"})
            .expect(200) 
            .end(function(err,res){
                res.status.should.equal(200)
                res.body.success.should.equal(true)
                res.body.should.have.property('token')
                if (err) return done(err)
                done();
            })
        })

        it("Tentativa de login inválida", function(done){
            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "invalido","senha": "invalida"})
            .expect(400) 
            .end(function(err,res){
                res.status.should.equal(400)
                res.body.success.should.equal(false)
                res.body.should.not.have.property('token')
                if (err) return done(err)
                done();
            })
        })

        it("Chamada de URL incorreta no login", function(done){
            server
            .post("/api/v1/usuario/login")
            .send({"cpf": "123","senha": "123"})
            .expect(404)
            .end(function(err,res){
                res.status.should.equal(404)
                if (err) return done(err)
                done();
            }) 
        })
    })

    describe("Testes de logout", function(){

        it("Chamada de URL incorreta no logout", function(done){
            server
            .post("/api/v1/usuario/logou")
            .expect(404)
            .end(function(err,res){
                res.status.should.equal(404)
                if (err) return done(err)
                done()
            })
        })
    })

    describe("Testes de informações de usuários", function(){

        it("Tentativa válida de obtenção de dados de usuário", function(done){

            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "12312312312","senha": "alemos123"})
            .end(function(errTk,resTk){
                server
                .post("/api/v1/usuario")
                .set({"x-access-token": resTk.body.token})
                .expect(200)
                .end(function(err,res){
                    res.status.should.equal(200)
                    res.body.should.have.property("nmUsuario")
                    res.body.should.have.property("sobrenomeUsuario")
                    res.body.should.have.property("dsEmail")
                    res.body.should.have.property("nrCPF")
                    if (err) return done(err)
                    done()
                })
            })
            
        })

        it("Tentativa inváliida de obtenção de dados de usuário", function(done){
            server
            .post("/api/v1/usuario")
            .set({"x-access-token": "esteNaoeUmTokenValido"})
            .expect(500)
            .end(function(err,res){
                res.status.should.equal(500)
                res.body.should.not.have.property("nmUsuario")
                res.body.should.not.have.property("sobrenomeUsuario")
                res.body.should.not.have.property("dsEmail")
                res.body.should.not.have.property("nrCPF")
                if (err) return done(err)
                done()
            })
        })

        it("Tentativa de obtenção de dados de usuário em URL incorreta", function(done){
            server
            .post("/api/v1/usuari")
            .set({"x-access-token": "esteNaoeUmTokenValido"})
            .expect(404)
            .end(function(err,res){
                res.status.should.equal(404)
                if (err) return done(err)
                done()
            })
        })
    })
})