const express = require("express");
const { confirmarSenhaBanco, verificarSenhaConta, verificarSenhaContaOrigem } = require("./validadores/validadorSenha");
const { dadosUsuario, contaExistente, verificarContaBody, verificarContaBodyOrigem, dadosSaldoExtrato } = require("./validadores/validadorDados");
const { listarContas, criarConta, atualizarUsuarioConta, excluirConta } = require("./controladores/controladoresConta");
const { depositar, sacar, transferir, emitirExtrato, consultarSaldo } = require("./controladores/controladores");

const rotas = express();

rotas.get("/contas", confirmarSenhaBanco, listarContas);
rotas.post("/contas", dadosUsuario, criarConta);
rotas.put("/contas/:numeroConta/usuario", dadosUsuario, contaExistente, atualizarUsuarioConta);
rotas.delete("/contas/:numeroConta", contaExistente, excluirConta);
rotas.post("/transacoes/depositar", verificarContaBody, depositar);
rotas.post("/transacoes/sacar", verificarContaBody, verificarSenhaConta, sacar);
rotas.post("/transacoes/transferir", verificarContaBodyOrigem, verificarSenhaContaOrigem, transferir);
rotas.get("/contas/saldo", dadosSaldoExtrato, consultarSaldo);
rotas.get("/contas/extrato", dadosSaldoExtrato, emitirExtrato);

module.exports = rotas;