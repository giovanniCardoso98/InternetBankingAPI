module.exports = (app) => {
    const { Conta, Transacao } = app.models;
    const { logs, retorno } = app.middlewares;

    const contaService = {
        getInformacoesConta(req, res) {
            Conta.find({ usuario: req.userId })
                .then(data => {
                    retorno.envia(res,200,true,null,null,data);
                }).catch(erro => {
                    logs.log('error', erro);
                    retorno.envia(res,400,false,erro,'Falha ao buscar informações da conta',null);
                });
        },
        salvaConta(req, res){
            var conta = new Conta();
            conta.usuario = req.body.usuario;
            conta.nrBanco = req.body.nrBanco;
            conta.nrAgencia = req.body.nrAgencia;
            conta.nrConta = req.body.nrConta;
            conta.vlSaldo = req.body.vlSaldo;

            conta.save()
                .then(x => { 
                    retorno.envia(res,200,true,null,null,{mensagem: 'Conta cadastrada com sucesso!'});
                }).catch(erro => {
                    logs.log('error', erro);
                    retorno.envia(res,400,false,erro,'Falha ao criar conta!',null);
                });
        },
        salvaFavorecido(req, res) {
            Conta.findOne({ usuario: req.userId })
                .then(data => {
                    var favorecidos = data.favorecidos;

                    if(favorecidos!=null) {
                        var checkFavorecido = favorecidos.find(item => 
                            item.agencia == req.body.agencia &&
                            item.conta == req.body.conta
                        );
                    }

                    if(checkFavorecido) {
                        res.status(400).send({success:false, erro:'Favorecido já existente'});
                    } else {
                        Conta.findOneAndUpdate({ usuario: req.userId }, {
                            $push: {favorecidos: req.body}
                            }).then(data => {
                                retorno.envia(res,200,true,'','',null);
                            }).catch(erro => {
                                logs.log('error', erro);
                                retorno.envia(res,400,false,erro,'Falha ao salvar favorecido',null);
                            });
                    }
                }).catch(erro => {
                    logs.log('error', erro);
                    retorno.envia(res,400,false,erro,'Falha ao salvar favorecido',null);
                });
        },
        deletarFavorecido(req, res){
            Conta.findOneAndUpdate({ usuario: req.userId },
                { $pull: { favorecidos: req.body }
                }).then(data => {
                    retorno.envia(res,200,true,'','',null);
                }).catch(erro => {
                    logs.log('error', erro);
                    retorno.envia(res,400,false,erro,'Falha ao deletar favorecido',null);
                });
        }
    };
    return contaService;
};