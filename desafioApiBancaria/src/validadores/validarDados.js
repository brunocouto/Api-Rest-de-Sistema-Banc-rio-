const { contas } = require("../bancodedados");

function dadosUsuario(req, res, next) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !data_nascimento || !telefone || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios!" });
    }

    const cpfExistente = contas.some(conta => conta.usuario.cpf === cpf);
    const emailExistente = contas.some(conta => conta.usuario.email === email);

    if (cpfExistente || emailExistente) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado!" });
    }

    next();
}

function contaExistente(req, res, next) {
    const numeroDaConta = Number(req.params.numeroConta);

    if (isNaN(numeroDaConta)) {
        return res.status(400).json({ mensagem: "O número da conta informada é inválido" });
    }

    const contaExistente = contas.find(conta => conta.numero === numeroDaConta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    next();
}

function verificarContaBody(req, res, next) {
    const numeroDaConta = req.body.numero_conta;

    if (!numeroDaConta || isNaN(Number(numeroDaConta))) {
        return res.status(400).json({ mensagem: "O número da conta é obrigatório e deve ser um valor válido!" });
    }

    const contaExistente = contas.find(conta => conta.numero === Number(numeroDaConta));

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    next();
}


function verificarContaBodyOrigem(req, res, next) {
    const numeroDaConta = req.body.numero_conta_origem;
    const contaExistenteOrigem = contas.find(conta => conta.numero === Number(numeroDaConta));

    if (!numeroDaConta || isNaN(Number(numeroDaConta)) || !contaExistenteOrigem) {
        return res.status(400).json({ mensagem: "Conta bancária de origem não encontrada ou número de conta de origem inválido." });
    }

    next();
}

function dadosSaldoExtrato(req, res, next) {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || isNaN(numero_conta)) {
        return res.status(400).json({ mensagem: "Número de conta inválido." });
    }

    const numeroConta = Number(numero_conta);
    const contaExistente = contas.find(conta => conta.numero === numeroConta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada." });
    }

    if (!senha || contaExistente.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha inválida." });
    }

    next();
}

module.exports = {
    dadosUsuario,
    contaExistente,
    verificarContaBody,
    verificarContaBodyOrigem,
    dadosSaldoExtrato
}