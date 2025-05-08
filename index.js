
const end = document.getElementById('end');
const rodape = document.getElementById('rodape');
const inputValorInicial = document.getElementById('inputValorInicial');
const valorAporteMensal = document.getElementById('cxAporteMensal');
const tempoInvestimento = document.getElementById('inputTempoIvestimento');
const resultado = document.getElementById('resultado');
const resultadoIpca = document.getElementById('resultadoIpca');
const resultadoTesouroPrefixado = document.getElementById('resultadoTesouroPrefixado');
const resultadoSimularPoupanca = document.getElementById('resultadoSimularPoupanca');
const resultadoCotacao = document.getElementById('resultadoCotacao');
const resultadoCotacaoBitcoin = document.getElementById('resultadoCotacaoBitcoin');

let requisicaoEmAndamento = false;
const btnSimular = document.getElementById('simular');

async function simular() {
    const valorInicial = parseFloat(inputValorInicial.value);
    const aporteMensal = parseFloat(valorAporteMensal.value);
    const tempoMeses = parseInt(tempoInvestimento.value);

    if (isNaN(valorInicial) || valorInicial <= 0) {
        alert('Digite um valor inicial válido.');
        return;
    }
    if (isNaN(tempoMeses) || tempoMeses <= 0) {
        alert('Digite um tempo válido de investimento (em meses).');
        return;
    }
    if (isNaN(aporteMensal) || aporteMensal < 0) {
        alert('Digite um valor válido de aporte mensal (pode ser zero).');
        return;
    }
    if (requisicaoEmAndamento) {
        console.log("Requisição em andamento...");
        return;
    }

    requisicaoEmAndamento = true;

    let cdiAnual = 0;
   //simulação cotação CDI/CDB
    try {
        const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1?formato=json');
        const data = await response.json();
        const cdiDiaria = parseFloat(data[0].valor.replace(',', '.')) / 100;
        cdiAnual = (Math.pow(1 + cdiDiaria, 252) - 1) * 100;
        const cdiMensal = Math.pow(1 + cdiAnual / 100, 1 / 12) - 1;

        let montante = valorInicial * Math.pow(1 + cdiMensal, tempoMeses);
        for (let i = 1; i <= tempoMeses; i++) {
            montante += aporteMensal * Math.pow(1 + cdiMensal, tempoMeses - i);
        }

        const valorInvestido = valorInicial + (aporteMensal * tempoMeses);

        resultado.innerHTML = `
            <p>📊 CDI hoje: <strong>${cdiAnual.toFixed(2)}%</strong> ao ano.</p>
            <p>💵 Rendimentos em CDBs com <strong>100% da CDI</strong>:</p>
            <p>💼 Valor inicial: R$ ${valorInicial.toFixed(2).replace('.', ',')}</p>
            <p>📥 Aporte mensal: R$ ${aporteMensal.toFixed(2).replace('.', ',')}</p>
            <p>⏳ Tempo: ${tempoMeses} meses</p>
            <p>💰 Total Investido: R$ ${valorInvestido.toFixed(2).replace('.', ',')}</p>
            <p>📈 Valor estimado ao final: <strong>R$ ${montante.toFixed(2).replace('.', ',')}</strong></p>
        `;
        resultado.style.display = 'block';
        descerRodape();
    } catch (error) {
        console.error("Erro ao buscar o CDI:", error);
        resultado.innerHTML = `<p style="color: red;">Erro ao buscar a taxa CDI. Tente novamente.</p>`;
        resultado.style.display = 'block';
    }
   // Simulação com IPCA e taxa real
try {
    // Consome a API para pegar o IPCA
    const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4466/dados/ultimos/1?formato=json');
    const data = await response.json();
    const ipcaAnual = parseFloat(data[0].valor.replace(',', '.'));
    
    // Converte IPCA anual para mensal
    const ipcaMensal = Math.pow(1 + ipcaAnual / 100, 1 / 12) - 1;
    
    // Define a taxa real (Exemplo: 5% ao ano, ou seja, 0,05)
    const taxaRealAnual = 5 / 100;  // 5% ao ano
    const taxaRealMensal = Math.pow(1 + taxaRealAnual, 1 / 12) - 1;  // Converte para mensal
    
    // Calcula o rendimento com IPCA + Taxa Real
    let montanteTotal = valorInicial * Math.pow(1 + ipcaMensal + taxaRealMensal, tempoMeses);
    
    // Calcula os aportes mensais, considerando tanto o IPCA quanto a taxa real
    for (let i = 1; i <= tempoMeses; i++) {
        montanteTotal += aporteMensal * Math.pow(1 + ipcaMensal + taxaRealMensal, tempoMeses - i);
    }
    
    // Calcula o valor total investido (valor inicial + aportes mensais)
    const valorInvestido = valorInicial + (aporteMensal * tempoMeses);
    
    // Exibe os resultados
    resultadoIpca.innerHTML = `
        <p>📊 Taxa IPCA hoje: <strong>${ipcaAnual.toFixed(2)}%</strong> ao ano.</p>
        <p>📊 Taxa Real: <strong>5%</strong> ao ano.</p>
        <p><em>Obs: Taxa anual acumulada nos últimos 12 meses.</em></p>
        <p>💼 Valor inicial: R$ ${valorInicial.toFixed(2).replace('.', ',')}</p>
        <p>📥 Aporte mensal: R$ ${aporteMensal.toFixed(2).replace('.', ',')}</p>
        <p>⏳ Tempo: ${tempoMeses} meses</p>
        <p>💰 Total Investido: R$ ${valorInvestido.toFixed(2).replace('.', ',')}</p>
        <p>📈 Valor estimado ao final: <strong>R$ ${montanteTotal.toFixed(2).replace('.', ',')}</strong></p>
    `;
    resultadoIpca.style.display = 'block';
    descerRodape();
} catch (error) {
    console.error("Erro ao consumir a API do IPCA:", error);
    resultadoIpca.innerHTML = `<p style="color: red;">Erro ao buscar a taxa IPCA. Tente novamente.</p>`;
    resultadoIpca.style.display = 'block';
}
    //simulação cotação Dólar

    try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/a3bd0af4bd2edf2c019b1628/latest/USD');
        const data = await response.json();
        const cotacaoDolar = data.conversion_rates.BRL;
        resultadoCotacao.innerHTML = `
            <p>📊 Cotação do Dólar hoje: <strong>R$ ${cotacaoDolar.toFixed(2)}</strong></p>
        `;
        resultadoCotacao.style.display = 'block';
    } catch (error) {
        console.error("Erro ao buscar cotação do dólar:", error);
        resultadoCotacao.innerHTML = `<p style="color: red;">Erro ao buscar cotação do dólar. Tente novamente.</p>`;
        resultadoCotacao.style.display = 'block';
    }
    // simulação cotação bitcoin
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
        const data = await response.json();
        const precoBitcoin = data.bitcoin.brl;
        resultadoCotacaoBitcoin.innerHTML = `
            <p>🪙 Cotação do Bitcoin hoje: <strong>R$ ${precoBitcoin.toFixed(2)}</strong></p>
        `;
        resultadoCotacaoBitcoin.style.display = 'block';
    } catch (error) {
        console.error("Erro ao buscar cotação do Bitcoin:", error);
        resultadoCotacaoBitcoin.innerHTML = `<p style="color: red;">Erro ao buscar cotação do Bitcoin.</p>`;
        resultadoCotacaoBitcoin.style.display = 'block';
        descerRodape();
    }

    //simulação da poupança
    const taxaPoupancaMensal = 0.005;
    let totalInvestido = valorInicial + (aporteMensal*tempoMeses);
    let montantePoupanca = valorInicial * Math.pow(1 + taxaPoupancaMensal, tempoMeses);
    for (let i = 1; i <= tempoMeses; i++) {
        montantePoupanca += aporteMensal * Math.pow(1 + taxaPoupancaMensal, tempoMeses - i);
    }

    resultadoSimularPoupanca.innerHTML = `
        <p>📊 Taxa de juros da Poupança: <strong>${(taxaPoupancaMensal * 100).toFixed(2)}% ao mês</strong></p>
        <p>💼 Valor inicial: R$ ${valorInicial.toFixed(2).replace('.', ',')}</p>
        <p>📥 Aporte mensal: R$ ${aporteMensal.toFixed(2).replace('.', ',')}</p>
        <p>⏳ Tempo: ${tempoMeses} meses</p>
        <p>💰 Total Investido : ${totalInvestido.toFixed(2).replace('.',',')}</p>
        <p>💰 Valor estimado ao final: <strong>R$ ${montantePoupanca.toFixed(2).replace('.', ',')}</strong></p>
    `;
    resultadoSimularPoupanca.style.display = 'block';
    descerRodape()

    requisicaoEmAndamento = false;
}

btnSimular.addEventListener('click', simular);

function descerRodape() {
    rodape.style.marginTop = '300px';
}

