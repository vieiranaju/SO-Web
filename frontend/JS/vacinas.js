// --- [ 1. CONFIGURAÇÃO INICIAL ] ---
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do DOM
    const inputBusca = document.getElementById('busca-pet');
    const tabelaCorpo = document.getElementById('tabela-corpo');
    const form = document.getElementById('form-vacina');
    
    // Cache para guardar os pets
    let petsCache = [];

    // --- [ 2. (NOVO) CARREGAR PETS NO DROPDOWN ] ---
    async function carregarPets() {
        try {
            const res = await fetch('http://localhost:3000/pets'); // (Assumindo que este é o endpoint)
            petsCache = res.ok ? await res.json() : [];
            
            const petSelect = document.getElementById('pet-select-vacina');
            petSelect.innerHTML = '<option value="" disabled selected>Selecione um pet...</option>';
            petsCache.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = `${p.nome} - (Dono: ${p.dono})`; 
                petSelect.appendChild(opt);
            });
        } catch (err) {
            console.warn('Erro ao carregar pets no formulário:', err);
        }
    }

    // --- [ 3. FUNCIONALIDADE: FILTRO DA TABELA (CORRIGIDO) ] ---
    inputBusca.addEventListener('keyup', () => {
        const termoBusca = inputBusca.value.toLowerCase();
        
        // A CORREÇÃO ESTÁ AQUI:
        // Nós pegamos as linhas da tabela AGORA, depois de elas
        // terem sido carregadas pelo carregarVacinas().
        const linhasTabela = tabelaCorpo.getElementsByTagName('tr');

        for (let i = 0; i < linhasTabela.length; i++) {
            const linha = linhasTabela[i];
            const nomePet = linha.getElementsByTagName('td')[0].textContent.toLowerCase();
            if (nomePet.includes(termoBusca)) {
                linha.style.display = "";
            } else {
                linha.style.display = "none";
            }
        }
    });

    // --- [ 4. FUNCIONALIDADE: CARREGAR VACINAS NA TABELA ] ---
    async function carregarVacinas() {
        try {
            const res = await fetch('http://localhost:3000/vacinas');
            const list = res.ok ? await res.json() : [];
            tabelaCorpo.innerHTML = '';
            
            list.forEach(v => {
                const row = tabelaCorpo.insertRow();
                
                // CORREÇÃO DE TIMEZONE: Adiciona timeZone: 'UTC' para 
                // evitar que a data mude (ex: dia 5 virar dia 4)
                const dataAplicacao = new Date(v.dataAplicacao).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
                const proximaDose = v.proximaDose 
                    ? new Date(v.proximaDose).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) 
                    : '-';

                row.innerHTML = `
                    <td>${v.petNome}</td>
                    <td>${v.nomeVacina}</td>
                    <td>${dataAplicacao}</td>
                    <td>${proximaDose}</td>
                    <td><button class="botao-tabela botao-excluir" data-id="${v.id}">Excluir</button></td>
                `;
            });

            // Adiciona listeners nos botões de excluir
            Array.from(document.getElementsByClassName('botao-excluir')).forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = btn.dataset.id;
                    if (!confirm('Deseja excluir este registro de vacina?')) return;
                    try {
                        const del = await fetch(`http://localhost:3000/vacinas/${id}`, { method: 'DELETE' });
                        if (!del.ok) throw new Error('Falha ao excluir');
                        await carregarVacinas();
                    } catch (err) {
                        console.error(err);
                        alert('Erro ao excluir. Veja o console para mais detalhes.');
                    }
                });
            });
        } catch (err) {
            console.error('Erro ao carregar vacinas:', err);
        }
    }

    // --- [ 5. FUNCIONALIDADE: ENVIO DO FORMULÁRIO (CORRIGIDO) ] ---
    form.addEventListener('submit', async (evento) => {
        evento.preventDefault(); 
        const dadosDoForm = new FormData(form);
        const dados = Object.fromEntries(dadosDoForm.entries());

        if (!dados.pet_id) {
            alert('Por favor, selecione um pet antes de salvar.');
            return;
        }

        const payload = {
            // O seu back-end de agenda (agenda.js) usa petId (int)
            // Vamos assumir que o de vacinas também quer o ID.
            petId: parseInt(dados.pet_id), 
            
            nomeVacina: dados.nome_vacina,
            dataAplicacao: dados.data_aplicacao,
            proximaDose: dados.proxima_dose || null
        };
        
        try {
            const res = await fetch('http://localhost:3000/vacinas', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Erro: ${res.status} ${text}`);
            }
            await carregarVacinas(); // Recarrega a tabela
            form.reset();
            alert('Registro salvo com sucesso.');
            inputBusca.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (err) {
            console.error(err);
            alert('Falha ao salvar. Veja o console para detalhes.');
        }
    });

    // --- [ 6. INICIALIZAÇÃO ] ---
    carregarPets(); // Carrega o dropdown
    carregarVacinas(); // Carrega a tabela

});