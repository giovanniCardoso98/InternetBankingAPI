var supertest = require('supertest')
var should = require('should')
var server = supertest.agent('localhost:3000')

describe("Testes de extrato", function(){

    describe("Testes obtenção de extratos", function(){

        it("Tentativa de obter extrato da conta do usuário", function(done){
            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "12312312312","senha": "alemos123"})
            .end(function(errTk,resTk){
                server
                .post("/api/v1/transacoes/extrato")
                .set({"x-access-token": resTk.body.token})
                .expect(200) 
                .end(function(err,res){
                    res.status.should.equal(200)
                    done();
                })
            })
        })
    })
})