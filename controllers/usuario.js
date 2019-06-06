module.exports = (app) => {
    const jwt = require('jsonwebtoken');
    const { usuario, Conta } = app.models;
    const bcrypt = require('bcrypt');
    const { logs, retorno } = app.middlewares;

    const usuarioService = {
        login(req, res) {
            const cpf = req.body.cpf;
            const senha = req.body.senha;

            usuario.findOne({ nrCPF: cpf })
                .then(data => {
                    const usuarioRetorno = data ? data.toObject() : null;
                    if (usuarioRetorno && bcrypt.compareSync(senha, usuarioRetorno.dsSenha)) {
                        const token = jwt.sign({ usuarioId: usuarioRetorno._id }, process.env.SECRET, {
                            expiresIn: 600
                        });
                        retorno.envia(res,200,true,null,null,{ success: true, token: token });
                    } else {
                        retorno.envia(res,400,false,null,null,{ success: false, erro:"Login Inválido" });
                    }
                }).catch(erro => {
                    logs.log('error', erro);
                    retorno.envia(res,400,false,null,null,erro);
                });
        },
        logout(req, res) {
            retorno.envia(res,200,true,null,null,{ success: true, auth: false, token: null });
        },
        getInformacoes(req, res) {
            usuario.findById(req.userId, { dsSenha: 0 })   
                .then(data => {
                    retorno.envia(res,200,false,null,null,data);
                }).catch(erro => {
                    logs.log('error', erro);
                    retorno.envia(res,400,false,null,null,erro);
                });
        },
        buscarUsuario(req, res) {
            Conta.findOne({ nrConta: req.body.conta })
                .then(dataConta => {
                    if(dataConta) {
                        usuario.findById(dataConta.usuario, { dsSenha: 0 })   
                            .then(dataUser => {
                                var dados = {
                                    conta: dataConta.nrConta,
                                    agencia: dataConta.nrAgencia,
                                    banco: dataConta.nrBanco,
                                    nome: dataUser.nmUsuario,
                                    sobrenome: dataUser.sobrenomeUsuario,
                                    cpf: dataUser.nrCPF,
                                    email: dataUser.dsEmail
                                }
                                retorno.envia(res,200,false,null,null,dados);
                            }).catch(erro => {
                                logs.log('error', erro);
                                retorno.envia(res,400,false,null,null,erro);
                            });
                    } else {
                        retorno.envia(res,400,false,'','Nenhum usuário encontrado',null);
                    }
                }).catch(erro => {
                    logs.log('error', erro);
                    retorno.envia(res,400,false,erro,'Falha ao buscar Usuario',null);
                });
        },
        listar(req, res) {
            usuario.find({}, { dsSenha: 0 })
            .then(data => {
                retorno.envia(res,200,true,null,null,data);
            }).catch(erro => {
                logs.log('error', erro);
                retorno.envia(res,400,false,null,null,erro);
            });
        },
        adicionar(req, res) {
            var novoUsuario = new usuario();
            novoUsuario.nmUsuario = req.body.nmUsuario;
            novoUsuario.sobrenomeUsuario = req.body.sobrenomeUsuario;
            novoUsuario.nrCPF = req.body.nrCPF
            novoUsuario.dsEmail = req.body.dsEmail

            if (req.body.dsSenha) {
                novoUsuario.dsSenha = bcrypt.hashSync(req.body.dsSenha, 10);

                novoUsuario.save()
                    .then(x => { 
                        retorno.envia(res,200,true,'','Usuario cadastrado com sucesso!',null);
                    }).catch(erro => {
                        logs.log('error', erro);
                        retorno.envia(res,400,false,erro,'Falha ao cadastrar o Usuario!',null);
                    });
            } else {
                logs.log('error', `"${req.method} ${req.url}" 400 (erro: Senha invalida)`);
                retorno.envia(res,400,false,null, null,{ success: false, erro:"Senha inválida" });
            }
        }
    };
    return usuarioService;
};