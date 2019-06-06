var supertest = require('supertest')
var should = require('should')
var server = supertest.agent('localhost:3000')

describe("Testes de conta", function(){

    describe("Testes obtenção de informações de conta", function(){

        it("Tentativa de obter conta do usuário válida", function(done){
            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "12312312312","senha": "alemos123"})
            .end(function(errTk,resTk){
                server
                .post("/api/v1/conta")
                .set({"x-access-token": resTk.body.token})
                .expect(200) 
                .end(function(err,res){
                    res.status.should.equal(200)
                    res.body = res.body[0]
                    res.body.should.have.property('nrBanco')
                    res.body.should.have.property('nrAgencia')
                    res.body.should.have.property('nrConta')
                    res.body.should.have.property('vlSaldo')
                    if (err) return done(err)
                    done();
                })
            })
        })

        it("Tentativa de obter conta do usuário inválida", function(done){
            server
            .post("/api/v1/conta")
            .set({"x-access-token":"esseTokenNaoÉValido"})
            .expect(500) 
            .end(function(err,res){
                res.body.should.not.have.property('nrBanco')
                res.body.should.not.have.property('nrAgencia')
                res.body.should.not.have.property('nrConta')
                res.body.should.not.have.property('vlSaldo')
                if (err) return done(err)
                done();
            })
        })

        it("Tentativa de obter conta do usuário com URL incoorreta", function(done){
            server
            .post("/api/v1/cont")
            .send({"idUsuario": 1})
            .expect(404) 
            .end(function(err,res){
                res.status.should.equal(404)
                if (err) return done(err)
                done();
            })
        })
    })

    describe("Testes de obtenção de favorecidos", function(){
        it("Tentativa válida de obtenção de dados de favorecidos", function(done){
            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "12312312312","senha": "alemos123"})
            .end(function(errTk,resTk){
                server
                .post("/api/v1/conta")
                .set({"x-access-token": resTk.body.token})
                .expect(200) 
                .end(function(err,res){
                    res.status.should.equal(200)
                    res.body = res.body[0]
                    res.body.should.have.property('favorecidos')
                    if (err) return done(err)
                    done();
                })
            })
        })

        it("Tentativa inválida de obtenção de dados de favorecidos", function(done){
            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "12312312312","senha": "alemos123"})
            .end(function(errTk,resTk){
                server
                .post("/api/v1/conta/favorecidos")
                .set({"x-access-token": resTk.body.token})
                .expect(404) 
                .end(function(err,res){
                    res.status.should.equal(404)
                    res.body.should.not.have.property('favorecidos')
                    if (err) return done(err)
                    done();
                })
            })
        })
    })
})