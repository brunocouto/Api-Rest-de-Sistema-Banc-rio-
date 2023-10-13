const { banco, contas } = require("../bancodedados");

function confirmarSenhaBanco(req, res, next) {
    const { senha_banco } = req.query;

    if (!senha_banco || senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    next();
}

function verificarSenhaConta(req, res, next) {
    const { numero_conta, senha } = req.body;

    const contaExistente = contas.find(conta => conta.numero === Number(numero_conta));
    if (!contaExistente || contaExistente.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "A senha informada é inválida!" });
    }

    next();
}

function verificarSenhaContaOrigem(req, res, next) {
    const { numero_conta_origem, senha } = req.body;

    const contaExistenteOrigem = contas.find(conta => conta.numero === Number(numero_conta_origem));
    if (!contaExistenteOrigem || contaExistenteOrigem.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "A senha da conta de origem informada é inválida!" });
    }

    next();
}

module.exports = {
    confirmarSenhaBanco,
    verificarSenhaConta,
    verificarSenhaContaOrigem
}