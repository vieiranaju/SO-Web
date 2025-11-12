// --- [ 1. CONFIGURAÇÃO INICIAL ] ---
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do DOM
    const inputBusca = document.getElementById('busca-pet');
    const tabelaCorpo = document.getElementById('tabela-corpo');
    const linhasTabela = tabelaCorpo.getElementsByTagName('tr');
    const form = document.getElementById('form-vacina');

    // --- [ 2. FUNCIONALIDADE: FILTRO DA TABELA ] ---
    inputBusca.addEventListener('keyup', () => {
        const termoBusca = inputBusca.value.toLowerCase();

        // Itera sobre todas as linhas da tabela
        for (let i = 0; i < linhasTabela.length; i++) {
            const linha = linhasTabela[i];
            
            // Pega o texto da primeira célula (Nome do Pet)
            const nomePet = linha.getElementsByTagName('td')[0].textContent.toLowerCase();

            // Compara o nome do pet com o termo de busca
            if (nomePet.includes(termoBusca)) {
                linha.style.display = ""; // Mostra a linha
            } else {
                linha.style.display = "none"; // Esconde a linha
            }
        }
    });


    // --- [ 3. FUNCIONALIDADE: ENVIO DO FORMULÁRIO (SIMULAÇÃO) ] ---
    form.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Impede o recarregamento da página

        // Pega os dados do formulário
        const dadosDoForm = new FormData(form);
        const dados = Object.fromEntries(dadosDoForm.entries());

        console.log("Dados prontos para enviar ao Back-end:", dados);
        
        // *** SIMULAÇÃO: Adiciona a nova linha na tabela ***
        // (O back-end fará isso de verdade no futuro)
        const novaLinha = tabelaCorpo.insertRow();
        novaLinha.innerHTML = `
            <td>${dados.nome_pet}</td>
            <td>${dados.nome_vacina}</td>
            <td>${new Date(dados.data_aplicacao).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
            <td>${dados.proxima_dose ? new Date(dados.proxima_dose).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '-'}</td>
            <td><button class="botao-tabela">Editar</button></td>
        `;

        // Limpa o formulário e avisa o usuário
        form.reset();
        alert("Registro salvo com sucesso! (Simulação)");
        
        // Rola a página de volta para o topo da tabela
        inputBusca.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

});