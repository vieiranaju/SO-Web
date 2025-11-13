// JS/clientes.js

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {

    // Elementos do DOM
    const inputBusca = document.getElementById('busca-cliente');
    const containerLista = document.getElementById('lista-clientes-container');
    const form = document.getElementById('form-cliente');

    // --- [ 1. CARREGAR (GET) ] ---
    async function carregarPets() {
        try {
            const res = await fetch(`${API_URL}/pets`);
            if (!res.ok) throw new Error('Falha ao carregar pets');
            const pets = await res.json();

            containerLista.innerHTML = '';

            // Lógica inteligente: Agrupar pets por dono
            const donos = {};
            pets.forEach(p => {
                if (!donos[p.dono]) donos[p.dono] = [];
                donos[p.dono].push(p);
            });

            // Renderiza os cards
            for (const dono in donos) {
                criarCardNaTela(dono, donos[dono]);
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Função auxiliar para desenhar o HTML
    function criarCardNaTela(nomeDono, listaPets) {
        const card = document.createElement('div');
        card.className = 'cliente-card';
        
        // Gera o HTML de cada pet com botão de excluir
        const petsHtml = listaPets.map(p => `
            <div class="pet-tag" style="display: inline-block; margin: 2px; padding: 5px; background: #eee; border-radius: 5px;">
                ${p.nome} <small>(${p.raca || 'SRD'})</small>
                <span onclick="deletarPet(${p.id})" style="cursor: pointer; color: red; margin-left: 5px; font-weight: bold;">&times;</span>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="cliente-info">
                <h4>${nomeDono}</h4>
                <p class="text-muted"><small>Contato não registrado</small></p>
            </div>
            <div class="cliente-pets" style="flex-grow: 1; text-align: right;">
                ${petsHtml}
            </div>
        `;
        containerLista.prepend(card); // Adiciona no topo
    }

    // --- [ 2. SALVAR (POST) com VALIDAÇÃO ] ---
    form.addEventListener('submit', async (evento) => {
        evento.preventDefault(); 

        const dadosDoForm = new FormData(form);
        const dados = Object.fromEntries(dadosDoForm.entries());

        // --- AQUI ENTRA A SUA VALIDAÇÃO ---
        if (dados.nome_dono.length < 3) {
            alert("O nome do dono deve ter pelo menos 3 letras!");
            return; // Para o código aqui e não salva
        }
        
        // Payload para o Backend
        const payload = {
            nome: dados.nome_pet,
            raca: dados.raca_pet || null,
            dono: dados.nome_dono,
            idade: dados.idade_pet ? parseInt(dados.idade_pet) : null
        };

        try {
            const res = await fetch(`${API_URL}/pets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error(`Erro: ${res.status}`);
            
            const novoPet = await res.json();
            
            alert('Salvo com sucesso!');
            form.reset();
            
            // Recarrega a lista para mostrar o novo item organizado
            carregarPets(); 

        } catch (err) {
            console.error(err);
            alert('Erro ao salvar.');
        }
    });

    // --- [ 3. FILTRO DE BUSCA ] ---
    inputBusca.addEventListener('keyup', () => {
        const termo = inputBusca.value.toLowerCase();
        const cards = document.getElementsByClassName('cliente-card');

        Array.from(cards).forEach(card => {
            const texto = card.textContent.toLowerCase();
            card.style.display = texto.includes(termo) ? "" : "none";
        });
    });

    // Inicia carregando a lista
    carregarPets();
});

// --- [ 4. DELETAR (DELETE) ] ---
// Precisa estar fora do EventListener para ser acessível pelo HTML onclick=""
window.deletarPet = async function(id) {
    if (confirm("Tem certeza que deseja excluir este pet?")) {
        try {
            const res = await fetch(`${API_URL}/pets/${id}`, {
                method: 'DELETE'
            });
            
            if (res.ok) {
                alert("Pet removido!");
                // Recarrega a página ou a função carregarPets
                location.reload(); 
            } else {
                alert("Erro ao deletar. Verifique se a rota DELETE existe no backend.");
            }
        } catch (error) {
            console.error(error);
        }
    }
}