module.exports = (app) => {
    const { Conta, transacao } = app.models;
    const { logs, retorno } = app.middlewares;
    const mongoose = require('mongoose');
    const Fawn = require("fawn");
    Fawn.init(mongoose);
    
    const transacaoService = {
        async transferir(req, res) {
            const { contaOrigem, agenciaOrigem, contaDestino, agenciaDestino, valor, observacao } = req.body;
            const task = Fawn.Task();
            var dadosContaOrigem, dadosContaDestino;
            var saldoSuficiente = true;
            var valorParse = parseFloat(valor);

            await Conta.findOne({ nrConta: contaOrigem, nrAgencia: agenciaOrigem })
                .then((dados) => {
                    if(dados) {
                        dadosContaOrigem = dados;
                        if((dadosContaOrigem.vlSaldo - valorParse) < 0) {
                            saldoSuficiente = false;
                            retorno.envia(res,400,false,'','Saldo insuficiente',null);
                        }
                    }
                })
                .catch(function(erro){
                    retorno.envia(res,400,false,erro,'Erro ao procurar conta origem',null);
                });
            
            if(saldoSuficiente) {
                await Conta.findOne({ nrConta: contaDestino, nrAgencia: agenciaDestino })
                    .then((dados) => {
                        dadosContaDestino = dados;
                    })
                    .catch(function(erro){
                        retorno.envia(res,400,false,erro,'Erro ao procurar conta destino',null);
                    });

                if(dadosContaOrigem && dadosContaDestino) {

                    const historicoOrigem = new transacao({
                        tpTransacao: "debito",
                        vlTransacao: valorParse,
                        contaRef: contaDestino,
                        agenciaRef: agenciaDestino,
                        observacao: observacao,
                        vlAnterior: dadosContaOrigem.vlSaldo,
                        vlAtual: dadosContaOrigem.vlSaldo - valorParse 
                    });

                    const historicoDestino = new transacao({
                        tpTransacao: "credito",
                        vlTransacao: valorParse,
                        contaRef: contaOrigem,
                        agenciaRef: agenciaOrigem,
                        observacao: observacao,
                        vlAnterior: dadosContaDestino.vlSaldo,
                        vlAtual: dadosContaDestino.vlSaldo + valorParse 
                    });

                    task.update("Conta", { nrConta: contaOrigem, nrAgencia: agenciaOrigem }, {$inc: {vlSaldo: -valorParse}, $push: {transacoes: historicoOrigem}})
                        .update("Conta", { nrConta: contaDestino, nrAgencia: agenciaDestino }, {$inc: {vlSaldo: valorParse}, $push: {transacoes: historicoDestino}})
                        .run({ useMongoose: true })
                        .then(function(results){
                            retorno.envia(res,200,true,null,'Transferência Realizada com Sucesso',null);
                        })
                        .catch(function(erro){
                            //rollback
                            logs.log('error', erro);
                            retorno.envia(res,400,false,erro,'Erro ao realizar transação',null);
                        });
                } else {
                    logs.log('error', `"${req.method} ${req.url}" contas: ${contaOrigem}-${agenciaOrigem} / ${contaDestino}-${agenciaDestino} 400 (erro: Conta não encontrada)`);
                    retorno.envia(res,400,false,null,'Conta não encontrada',null);
                }
            }

        },
        listar(req, res) {
            const { filtroTipo, filtroDataDe, filtroDataAte, filtroConta } = req.body;


            var filtro = '"usuario": "' + req.userId + '",';
            filtroTipo ? filtro += '"transacoes.tpTransacao": "' + filtroTipo + '",' : null;
            filtroDataDe ? filtro += '"transacoes.dtTransacao": {"$gte": "' + filtroDataDe + '"},' : null;
            filtroDataAte ? filtro += '"transacoes.dtTransacao": {"$lt": "' + filtroDataAte + '"},' : null;
            filtroConta ? filtro += '"transacoes.contaRef": "' + filtroConta + '",' : null;

            Conta.findOne(JSON.parse('{' + filtro.replace(/,+$/,'') + '}'))
                .then(dados => {
                    if(dados) {
                        retorno.envia(res,200,true,null,null,dados.transacoes);
                    } else {
                        retorno.envia(res,200,true,null,null,[]);
                    }
                })
                .catch(erro => {
                    logs.log('error', erro);
                    retorno.envia(res,400,false,null,'Erro ao buscar transações',null);
                })
        }
    };
    return transacaoService;
};