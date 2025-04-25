// Função que calcula os valores proporcionais de desativação e inputa as faturas anteriores como prevenção

function calcularDesativacao() {
    // Obtenção de valores dos campos de entrada   new Date(document.getElementById('dataVencimento').value + 'T00:00:00');
    const valorPlano = parseFloat(document.getElementById('valorPlano').value);
    const mesesFaturas = parseInt(document.getElementById('mesesFaturas').value);
    const dataVencimento = new Date(document.getElementById('dataVencimento').value + 'T00:00:00');
    const dataUltimoAcesso = new Date(document.getElementById('dataUltimoAcesso').value + 'T00:00:00');
    const valorMultaDigitado = parseFloat(document.getElementById('valorMulta').value);
    const multaEquipamento = parseFloat(document.getElementById('multaEquipamento').value);
    const meses = parseInt(document.getElementById('meses').value);

    if (isNaN(valorPlano) || isNaN(mesesFaturas) || isNaN(dataVencimento.getTime()) || isNaN(dataUltimoAcesso.getTime()) || isNaN(valorMultaDigitado) || isNaN(meses)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Seta a data para o calculo ser referente ao dia do vencimento anterior para calcular o proporcional decorrendo daquele dia
    const dataParaCalculo = new Date(dataVencimento);
    dataParaCalculo.setMonth(dataParaCalculo.getMonth() - 1);
    dataParaCalculo.setDate(dataParaCalculo.getDate() - 1);

    // Chama a função calcularProporcional para obter os cálculos
    const resultado = calcularProporcional30(valorPlano, dataParaCalculo, dataUltimoAcesso);


    
    // Cálculo dos valores das faturas anteriores e proporcional considerando os meses de faturas
    const datasFaturas = [];
    for (let i = mesesFaturas; i > 0; i--) {
        const dataFatura = new Date(dataVencimento);
        if(dataFatura.getDate() == 30 && dataFatura.getMonth() - i == 1) {
            dataFatura.setDate(28);
            dataFatura.setMonth(dataFatura.getMonth() - i);
            const dataFaturaFormatada = `${(dataFatura.getDate()).toString().padStart(2, '0')}/${(dataFatura.getMonth() + 1).toString().padStart(2, '0')}/${dataFatura.getFullYear()}`;
            datasFaturas.push(dataFaturaFormatada);
            dataFatura.setDate(30);
        } else{
            dataFatura.setMonth(dataFatura.getMonth() - i);
            const dataFaturaFormatada = `${(dataFatura.getDate()).toString().padStart(2, '0')}/${(dataFatura.getMonth() + 1).toString().padStart(2, '0')}/${dataFatura.getFullYear()}`;
            datasFaturas.push(dataFaturaFormatada);
        }
    }

    // Formatação das datas para exibição
    let faturasTexto = '';
    datasFaturas.forEach((data, index) => {
        faturasTexto += `${data} - R$ ${valorPlano.toFixed(2)}\n`;
    });
    
    const dataProporcionalFormatada = `${(dataVencimento.getDate()).toString().padStart(2, '0')}/${(dataVencimento.getMonth() + 1).toString().padStart(2, '0')}/${dataVencimento.getFullYear()}`;

    const valorProporcionalMes = resultado.valorTotal.toFixed(2);
    const valorFatura = valorPlano.toFixed(2);

    // Cálculo da multa
    let textoMulta;
    let valorMulta = 0;
    if (meses === 0) {
        textoMulta = "MULTA RESCISÓRIA : R$  (  ) SIM    ( X ) NÃO";
    } else {
        valorMulta = ((valorMultaDigitado - multaEquipamento) * meses) / 12;
        textoMulta = "MULTA RESCISÓRIA : R$  ( X ) SIM    (  ) NÃO";
    }

    // Mensagem de uso total
    const usoTexto = `REF ${resultado.totalDias} DIAS DE USO`;
    document.getElementById('usoTotal').value = usoTexto;

    
    // Mensagem de protocolo
    let protocoloTexto = `CONTRATO DESATIVADO\n` +
        `Ajustado Faturas Referente aos dias utilizados :\n\n` +
        `${faturasTexto}`+
        `${dataProporcionalFormatada} - R$ ${valorProporcionalMes}\n\n` +
        `${textoMulta}\n` +
        `VALOR DA MULTA: R$ ${valorMulta.toFixed(2)}\n`;
    // Verifica o status do equipamento pelo botão lógico
    const statusEquipamento = document.getElementById('statusEquipamento').value;
    if (statusEquipamento === "Extraviado") {
        protocoloTexto += `MULTA ONU: R$ ${multaEquipamento.toFixed(2)}\n\n`;
    }
    protocoloTexto += `ENVIADO SMS DE PRÉ INCLUSÃO`;
    document.getElementById('protocolo').value = protocoloTexto;
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // 🔥 impede o comportamento padrão (submit)
      calcularDesativacao();
    }
  });


// Adiciona o evento de clique dos resultados para copiar o texto do textarea para a área de transferência
document.getElementById('protocolo').addEventListener('click', function() {
    this.select();  // Seleciona todo o conteúdo do textarea
    document.execCommand('copy');  // Copia o conteúdo selecionado para a área de transferência
    alert('Protocolo copiado!');  // Exibe um alerta (opcional)
  });

document.getElementById('usoTotal').addEventListener('click', function() {
    this.select();  // Seleciona todo o conteúdo do textarea
    document.execCommand('copy');  // Copia o conteúdo selecionado para a área de transferência
    alert('Uso Total copiado!');  // Exibe um alerta (opcional)
  });