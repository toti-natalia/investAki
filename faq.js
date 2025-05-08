
const respostas = {
    resSelic: 'É a taxa básica de juros da economia brasileira. Serve como referência para todas as outras taxas (empréstimos, investimentos, etc.). Quando ela sobe, os juros de tudo geralmente sobem também.',
    resIpca: 'O IPCA é o índice que mede a inflação oficial no Brasil. Ele mostra quanto os preços subiram (ou caíram) em média.',
    resCdb: 'O CDB é um investimento onde você empresta dinheiro ao banco e recebe de volta com juros. Pode render com base na Selic ou no CDI.',
    resInvestir: 'Investir é aplicar seu dinheiro para que ele cresça com o tempo, em opções como renda fixa (CDB, Tesouro Direto) ou variável (ações, fundos). Você pode optar entre corretoras e bancos que possuem maiores condições de Juros. Em breve novas atualizações com recomendações de onde investir.',
    resJurosCompostos: 'Juros compostos são uma forma de cálculo de juros onde os juros são aplicados sobre o capital inicial e também sobre os juros acumulados de períodos anteriores. Isso significa que, a cada período, os juros gerados são adicionados ao capital, resultando em um aumento mais rápido do montante total em comparação aos juros simples, que são calculados apenas sobre o capital inicial. Esse tipo de juros é amplamente utilizado em transações financeiras, como empréstimos e investimentos.'
};

function toggleConteudo(id) {
    const elemento = document.getElementById(id);

    if (elemento.style.display === 'block') {
        elemento.style.display = 'none';
    } else {
        for (let chave in respostas) {
            document.getElementById(chave).style.display = 'none';
        }

        // Ajuste para posicionar corretamente abaixo do botão
        elemento.innerText = respostas[id];
        elemento.style.padding = '20px';
        elemento.style.backgroundColor = 'white';
        elemento.style.display = 'block';
        elemento.style.width = '100%';
        elemento.style.marginTop = '10px';
        elemento.style.borderRadius = '25px';
        elemento.style.textAlign = 'center';
    }
}

// Eventos
document.getElementById('btn-selic').addEventListener('click', () => toggleConteudo('resSelic'));
document.getElementById('btn-ipca').addEventListener('click', () => toggleConteudo('resIpca'));
document.getElementById('btn-cdb').addEventListener('click', () => toggleConteudo('resCdb'));
document.getElementById('btn-resJurosCompostos').addEventListener('click', () => toggleConteudo('resJurosCompostos'));
document.getElementById('btn-investir').addEventListener('click', () => toggleConteudo('resInvestir'));

