var supertest = require('supertest')
var should = require('should')
var server = supertest.agent('localhost:3000')

describe("Testes de transações", function(){

    describe("Testes de transferências entre contas", function(){

        it("Tentativa de transferencia com sucesso", function(done){
            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "12312312312","senha": "alemos123"})
            .end(function(errTk,resTk){
                server
                .post("/api/v1/conta")
                .set({"x-access-token": resTk.body.token})
                .expect(200) 
                .end(function(err,resCt){
                    server
                    .post("/api/v1/transacoes/transferir")
                    .set({"x-access-token": resTk.body.token})
                    .send({ "contaOrigem": "123456789","agenciaOrigem" : "11955","contaDestino" : "567890123",
                        "agenciaDestino" : "11955","valor": 10,"observacao": "observação da transação"})
                    .expect(200) 
                    .end(function(err,res){
                        res.body.success.should.equal(true)
                        res.body.mensagem.should.equal("Transferência Realizada com Sucesso")
                        done();
                    })
                })
            })
        })

        it("Tentativa de transferencia com saldo insuficiente", function(done){
            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "12312312312","senha": "alemos123"})
            .end(function(errTk,resTk){
                server
                .post("/api/v1/conta")
                .set({"x-access-token": resTk.body.token})
                .expect(200) 
                .end(function(err,resCt){
                    server
                    .post("/api/v1/transacoes/transferir")
                    .set({"x-access-token": resTk.body.token})
                    .send({ "contaOrigem": "123456789","agenciaOrigem" : "11955","contaDestino" : "567890123",
                        "agenciaDestino" : "11955","valor": 9999999,"observacao": "observação da transação"})
                    .expect(200) 
                    .end(function(err,res){
                        res.body.success.should.equal(false)
                        res.body.mensagem.should.equal("Saldo insuficiente")
                        done();
                    })
                })
            })
        })

        it("Tentativa de transferencia para conta não cadastrada", function(done){
            server
            .post("/api/v1/usuario/logon")
            .send({"cpf": "12312312312","senha": "alemos123"})
            .end(function(errTk,resTk){
                server
                .post("/api/v1/conta")
                .set({"x-access-token": resTk.body.token})
                .expect(200) 
                .end(function(err,resCt){
                    server
                    .post("/api/v1/transacoes/transferir")
                    .set({"x-access-token": resTk.body.token})
                    .send({ "contaOrigem": "123456789","agenciaOrigem" : "11955","contaDestino" : "000000000",
                        "agenciaDestino" : "11955","valor": 1,"observacao": "observação da transação"})
                    .expect(200) 
                    .end(function(err,res){
                        res.body.success.should.equal(false)
                        res.body.mensagem.should.equal("Conta não encontrada")
                        done();
                    })
                })
            })
        })


    })
})