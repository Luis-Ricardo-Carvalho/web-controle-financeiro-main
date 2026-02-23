const form = document.getElementById('form');
const descInput = document.querySelector('#descricao');
const valorInput = document.querySelector('#montante');
const balancoH1 = document.querySelector('#balanco');
const receitaP = document.querySelector('#din-positivo');
const despesaP = document.querySelector('#din-negativo');

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Recuperar os valores
    const descTransacao = descInput.value.trim();
    const valorTransacao = valorInput.value.trim();

    // Validar os inputs
    if (descTransacao === ""){
        alert("A descrição da transação não pode ser vazia.");
        return;
    }

    if (valorTransacao === ""){
        alert("A valor da transação não pode ser vazio.");
        return;
    }

    // Criar objeto da transação
    const transacao = {
        id: parseInt(Math.random() * 1000),
        descricao: descTransacao,
        valor: parseFloat(valorTransacao)
    };

    somaAoSaldo(transacao);
    somaReceitaDespesa(transacao);

    descInput.value = "";
    valorInput.value = "";
}); // Fim addEventLisneter do form


// Métodos auxiliares
function somaAoSaldo(transacao){
    const valorTransacao = transacao.valor;

    let total = balancoH1.innerHTML.replace("R$","");
    total = parseFloat(total);
    total += valorTransacao;

    balancoH1.innerHTML = `R$${total}`;
}

function somaReceitaDespesa(transacao){
    const elementoAlterado = transacao.valor > 0 ? receitaP : despesaP;
    const substituir = transacao.valor > 0 ? "+ R$" : "- R$";

    let valor = elementoAlterado.innerHTML.replace(substituir, "");
    valor = parseFloat(valor);

    const valorTransacao = transacao.valor;
    valor += Math.abs(valorTransacao);

    elementoAlterado.innerHTML = `${substituir}${valor}`;
}