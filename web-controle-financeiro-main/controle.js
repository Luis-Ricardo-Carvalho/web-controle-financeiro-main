const form = document.getElementById('form');
const descInput = document.querySelector('#descricao');
const valorInput = document.querySelector('#montante');
const balancoH1 = document.querySelector('#balanco');
const receitaP = document.querySelector('#din-positivo');
const despesaP = document.querySelector('#din-negativo');
const transacoesUl = document.querySelector('#transacoes');

const chave_transacoes_ls = 'transacoes';

let transacoesSalvas = JSON.parse(localStorage.getItem(chave_transacoes_ls)) || [];

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const descTransacao = descInput.value.trim();
    const valorTransacao = valorInput.value.trim();
    const tipoTransacao = document.querySelector('input[name="tipo"]:checked').value;

    if(descTransacao === "" || valorTransacao === "") return;

    let valorFinal = parseFloat(valorTransacao);

    if(tipoTransacao === "despesa"){
        valorFinal = -Math.abs(valorFinal);
    } else {
        valorFinal = Math.abs(valorFinal);
    }

    const novoId = transacoesSalvas.reduce((maiorId, transacao) => {
        return transacao.id > maiorId ? transacao.id : maiorId;
    }, -1) + 1;

    const transacao = {
        id: novoId,
        descricao: descTransacao,
        valor: valorFinal
    };

    transacoesSalvas.push(transacao);
    localStorage.setItem(chave_transacoes_ls, JSON.stringify(transacoesSalvas));

    carregarDados();

    descInput.value = "";
    valorInput.value = "";
});

function carregarDados(){
    transacoesUl.innerHTML = "";
    balancoH1.innerHTML = "R$0.00";
    receitaP.innerHTML = "+ R$0.00";
    despesaP.innerHTML = "- R$0.00";

    transacoesSalvas.forEach(transacao => {
        atualizarValores(transacao);
        addTransacaoAoDOM(transacao);
    });
}

function atualizarValores(transacao){
    let saldoAtual = parseFloat(balancoH1.innerHTML.replace("R$", ""));
    saldoAtual += transacao.valor;
    balancoH1.innerHTML = `R$${saldoAtual.toFixed(2)}`;

    if(transacao.valor > 0){
        let receitaAtual = parseFloat(receitaP.innerHTML.replace("+ R$", ""));
        receitaAtual += transacao.valor;
        receitaP.innerHTML = `+ R$${receitaAtual.toFixed(2)}`;
    } else {
        let despesaAtual = parseFloat(despesaP.innerHTML.replace("- R$", ""));
        despesaAtual += Math.abs(transacao.valor);
        despesaP.innerHTML = `- R$${despesaAtual.toFixed(2)}`;
    }
}

function addTransacaoAoDOM(transacao){
    const classeCSS = transacao.valor < 0 ? "negativo" : "positivo";
    const sinal = transacao.valor < 0 ? "-" : "";
    const valorAbs = Math.abs(transacao.valor).toFixed(2);

    const li = document.createElement('li');
    li.classList.add(classeCSS);

    li.setAttribute("id", `transacao-${transacao.id}`);

    li.innerHTML = `
        ${transacao.descricao}
        <span>${sinal}R$${valorAbs}</span>
        <button class="delete-btn" onclick="deletaTransacao(${transacao.id})">X</button>
    `;

    transacoesUl.append(li);
}

function atualizarValoresRemocao(transacao){
    let saldoAtual = parseFloat(balancoH1.innerHTML.replace("R$", ""));
    saldoAtual -= transacao.valor;
    balancoH1.innerHTML = `R$${saldoAtual.toFixed(2)}`;

    if(transacao.valor > 0){
        let receitaAtual = parseFloat(receitaP.innerHTML.replace("+ R$", ""));
        receitaAtual -= transacao.valor;
        receitaP.innerHTML = `+ R$${receitaAtual.toFixed(2)}`;
    } else {
        let despesaAtual = parseFloat(despesaP.innerHTML.replace("- R$", ""));
        despesaAtual -= Math.abs(transacao.valor);
        despesaP.innerHTML = `- R$${despesaAtual.toFixed(2)}`;
    }
}

function deletaTransacao(id){
    const transacao = transacoesSalvas.find(t => t.id === id);
    
    if(!transacao) return;

    transacoesSalvas = transacoesSalvas.filter(t => t.id !== id);
    localStorage.setItem(chave_transacoes_ls, JSON.stringify(transacoesSalvas));

    const li = document.getElementById(`transacao-${id}`);
    li.remove();
    atualizarValoresRemocao(transacao);
}

carregarDados();