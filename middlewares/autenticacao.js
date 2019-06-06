module.exports = (app) => {
    const jwt = require('jsonwebtoken');

    const autenticacao = {
        verificaJWT(req, res, next) {
            var token = req.headers['x-access-token'];
            if (!token) return res.status(401).send({ auth: false, message: 'Token não informado' });
            
            jwt.verify(token, process.env.SECRET, function(err, decoded) {
                if (err) return res.status(500).send({ auth: false, message: 'Token inválido' });
                
                req.userId = decoded.usuarioId;
                next();
            });
        }
    }

    return autenticacao;
}