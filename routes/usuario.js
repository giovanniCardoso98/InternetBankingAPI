module.exports = (app) => {
    const { usuario } = app.controllers;
    const { autenticacao } = app.middlewares;    

    app.post('/api/v1/usuario/logon', usuario.login);
    app.get('/api/v1/usuario/logout', usuario.logout);
    app.post('/api/v1/usuario', autenticacao.verificaJWT, usuario.getInformacoes);
    app.post('/api/v1/usuario/buscar', autenticacao.verificaJWT, usuario.buscarUsuario);

    app.post('/api/v1/usuario/listar', autenticacao.verificaJWT, usuario.listar);
    app.post('/api/v1/usuario/adicionar', autenticacao.verificaJWT, usuario.adicionar);
};