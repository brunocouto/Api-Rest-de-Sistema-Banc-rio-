const { contas, depositos, saques, transferencias } = require("../bancodedados");

let numeroProximaContaCriada = 1;

function listarContas(req, res) {
    return res.json(contas);
}

function criarConta(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!cpf) {
        return res.status(400).json({ mensagem: "O cpf deve ser informado!" });
    }
    if (!email) {
        return res.status(400).json({ mensagem: "O e-mail deve ser informado!" });
    }

    const novaConta = {
        numero: numeroProximaContaCriada++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(novaConta);

    return res.status(201).json();


}

function atualizarUsuarioConta(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    const contaExistente = contas.find(conta => conta.numero === Number(numeroConta));

    contaExistente.usuario.nome = nome;
    contaExistente.usuario.data_nascimento = data_nascimento;
    contaExistente.usuario.telefone = telefone;
    contaExistente.usuario.senha = senha;
    if (cpf) {
        contaExistente.usuario.cpf = cpf;
    }
    if (email) {
        contaExistente.usuario.email = email;
    }

    return res.status(200).json();

}

function excluirConta(req, res) {
    const { numeroConta } = req.params;

    const contaExistente = contas.find(conta => conta.numero === Number(numeroConta));
    const indiceConta = contas.findIndex(conta => conta.numero === Number(numeroConta));

    if (contaExistente.saldo !== 0) {
        return res.status(403).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    }
    if (indiceConta < 0) {
        return res.status(404).json({ mensagem: "Não existe conta a ser excluída para o número informado!" });
    }

    contas.splice(indiceConta, 1);

    return res.status(204).json();

}


module.exports = {
    listarContas,
    criarConta,
    atualizarUsuarioConta,
    excluirConta

}