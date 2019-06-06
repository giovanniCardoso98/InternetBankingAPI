module.exports = (app) => {
    const retornoMiddleware = {
        envia(res, statusResponse, sucesso, detalheErro, mensagem, json) {
            if(json==null) {
                json = {
                    success: sucesso,
                    mensagem: mensagem,
                    detalhe: detalheErro
                };
            }
            res.status(statusResponse).send(json);
        }
    };
    return retornoMiddleware;
};