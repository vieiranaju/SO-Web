// --- [ 1. CONFIGURAÇÃO INICIAL ] ---
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do DOM
    const inputBusca = document.getElementById('busca-cliente');
    const containerLista = document.getElementById('lista-clientes-container');
    const clientesCard = containerLista.getElementsByClassName('cliente-card');
    const form = document.getElementById('form-cliente');

    // --- [ 2. FUNCIONALIDADE: FILTRO DA LISTA ] ---
    inputBusca.addEventListener('keyup', () => {
        const termoBusca = inputBusca.value.toLowerCase();

        // Itera sobre todos os "cards" de cliente
        for (let i = 0; i < clientesCard.length; i++) {
            const card = clientesCard[i];
            
            // Pega o texto do card (nome, telefone, pets)
            const textoCard = card.textContent.toLowerCase();

            // Compara o texto com o termo de busca
            if (textoCard.includes(termoBusca)) {
                card.style.display = ""; // Mostra o card
            } else {
                card.style.display = "none"; // Esconde o card
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
        
        // *** SIMULAÇÃO: Adiciona o novo cliente na lista ***
        const novoCard = document.createElement('div');
        novoCard.className = 'cliente-card';
        novoCard.innerHTML = `
            <div class="cliente-info">
                <h4>${dados.nome_dono}</h4>
                <p>${dados.telefone_dono}</p>
            </div>
            <div class="cliente-pets">
                <span>Pets:</span>
                <span class="pet-tag">${dados.nome_pet} (${dados.raca_pet || 'SRD'})</span>
            </div>
        `;
        
        // Adiciona o novo card no topo da lista
        containerLista.prepend(novoCard);

        // Limpa o formulário e avisa o usuário
        form.reset();
        alert("Cliente salvo com sucesso! (Simulação)");
    });
});