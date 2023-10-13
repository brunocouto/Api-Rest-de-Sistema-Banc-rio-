const { contas, depositos, banco, saques, transferencias } = require("../bancodedados");
const { format } = require("date-fns");



function consultarSaldo (req, res) {
    const { numero_conta } = req.query;
    const contaExistente = contas.find(conta => conta.numero === Number(numero_conta));

    const consultaSaldo = {
        saldo: contaExistente.saldo
    }

    return res.json(consultaSaldo);
}

function emitirExtrato (req, res){
    const { numero_conta } = req.query;
    const depositosConta = depositos.filter(deposito => deposito.numero_conta === numero_conta);
    const saquesConta = saques.filter(saque => saque.numero_conta === numero_conta);
    const transferenciasRealizadasConta = transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta);
    const transferenciasRecebidasConta = transferencias.filter(transferencia => transferencia.numero_conta_destino === numero_conta);

    const emissaoExtrato = {
        depositos: depositosConta,
        saques: saquesConta,
        transferenciasEnviadas: transferenciasRealizadasConta,
        transferenciasRecebidas: transferenciasRecebidasConta
    }

    return res.json(emissaoExtrato);
}

function depositar(req, res) {
    const { valor, numero_conta } = req.body;
    
    if (isNaN(valor) || valor <= 0) {
        return res.status(400).json({ mensagem: "O valor do depósito deve ser um número maior que zero!" });
    }

    const contaExistente = contas.find(conta => conta.numero === Number(numero_conta));

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    contaExistente.saldo = parseFloat(contaExistente.saldo) + parseFloat(valor);

    const novoDeposito = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    }

    depositos.push(novoDeposito);

    return res.status(201).json();
}

function sacar(req, res) {
    const { numero_conta, valor } = req.body;

    if (isNaN(valor) || valor <= 0) {
        return res.status(400).json({ mensagem: "O valor do saque deve ser um número maior que zero!" });
    }

    const contaExistente = contas.find(conta => conta.numero === Number(numero_conta));

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    const saldoAtual = parseFloat(contaExistente.saldo);
    if (valor > saldoAtual) {
        return res.status(403).json({ mensagem: "Saldo insuficiente para o saque!" });
    }

    contaExistente.saldo = saldoAtual - parseFloat(valor);

    const novoSaque = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    }

    saques.push(novoSaque);

    return res.status(201).json();
}

function transferir(req, res){
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;
 
        const contaExistenteOrigem = contas.find(conta => conta.numero === Number(numero_conta_origem));
        const contaExistenteDestino = contas.find(conta => conta.numero === Number(numero_conta_destino));

        if (!numero_conta_destino) {
            return res.status(400).json({ mensagem: "O número da conta de destino é obrigatório!" });
        }
        if (valor === undefined || valor === null) {
            return res.status(400).json({ mensagem: "O valor é obrigatório!" });
        }
        if (isNaN(Number(numero_conta_destino))) {
            return res.status(400).json({ mensagem: "O número da conta de destino informada é inválido!" });
        }
        if (!contaExistenteDestino) {
            return res.status(404).json({ mensagem: "Conta bancária de destino não encontrada!" });
        }
        if (valor <= 0) {
            return res.status(403).json({ mensagem: "O valor do depósito deve ser maior que zero!" });
        }
        if (valor > contaExistenteOrigem.saldo) {
            return res.status(403).json({ mensagem: "Saldo insuficiente!" });
        }

        contaExistenteOrigem.saldo -= valor;
        contaExistenteDestino.saldo += valor;

        const novaTransferencia = {
            data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            numero_conta_origem,
            numero_conta_destino,
            valor
        }

        transferencias.push(novaTransferencia);

        return res.status(201).json();

    
}


module.exports = {
    consultarSaldo,
    emitirExtrato,
    depositar,
    sacar,
    transferir
}

