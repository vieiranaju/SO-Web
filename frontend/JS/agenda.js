// --- [ 1. CONFIGURAÇÃO INICIAL ] ---
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do DOM que vamos usar
    const mesAnoElemento = document.getElementById('mes-ano-atual');
    const diasGridElemento = document.querySelector('.calendario-dias');
    const mesAnteriorBtn = document.getElementById('mes-anterior');
    const proximoMesBtn = document.getElementById('proximo-mes');
    const horariosTitulo = document.getElementById('horarios-titulo');
    const horariosLista = document.getElementById('horarios-lista');
    
    // Seleciona os campos do formulário
    const form = document.getElementById('form-agendamento');
    const formInputData = document.getElementById('data');
    const formInputHora = document.getElementById('hora');

    // Guarda a data de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera o tempo para comparações

    // Guarda a data que está sendo exibida no calendário
    let dataAtual = new Date();

    // Nomes dos meses (para exibir no título)
    const nomeDosMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // --- [ 2. FUNÇÃO PRINCIPAL: RENDERIZAR O CALENDÁRIO ] ---
    function renderizarCalendario() {
        // Zera o tempo da data atual para evitar bugs de fuso horário
        dataAtual.setDate(1); // Sempre começa do dia 1

        const mes = dataAtual.getMonth();
        const ano = dataAtual.getFullYear();

        // Define o título (ex: "Novembro 2025")
        mesAnoElemento.textContent = `${nomeDosMeses[mes]} ${ano}`;

        // Limpa os dias do calendário anterior
        // (Mantém os 7 primeiros elementos, que são os dias da semana)
        while (diasGridElemento.children.length > 7) {
            diasGridElemento.removeChild(diasGridElemento.lastChild);
        }

        // Lógica para encontrar o primeiro dia da semana (Dom=0, Seg=1...)
        const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
        // Lógica para encontrar o último dia do mês
        const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();

        // 1. Preenche os dias do mês anterior (para completar o grid)
        const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
        for (let i = primeiroDiaDoMes; i > 0; i--) {
            const diaElemento = document.createElement('div');
            diaElemento.classList.add('dia-calendario', 'outro-mes');
            diaElemento.textContent = ultimoDiaMesAnterior - i + 1;
            diasGridElemento.appendChild(diaElemento);
        }

        // 2. Preenche os dias do mês atual
        for (let i = 1; i <= ultimoDiaDoMes; i++) {
            const diaElemento = document.createElement('div');
            diaElemento.classList.add('dia-calendario');
            diaElemento.textContent = i;
            
            const dataCompleta = new Date(ano, mes, i);

            // Marca o dia de hoje
            if (dataCompleta.getTime() === hoje.getTime()) {
                diaElemento.classList.add('hoje');
            }

            // Simula dias com eventos (para o back-end preencher)
            if (i === 13 || i === 18 || i === 28) {
                diaElemento.classList.add('com-evento');
            }
            
            // Adiciona o evento de clique em cada dia
            diaElemento.addEventListener('click', () => {
                // Remove o 'selecionado' de qualquer outro dia
                const diaAtivo = document.querySelector('.dia-calendario.selecionado');
                if (diaAtivo) {
                    diaAtivo.classList.remove('selecionado');
                }
                // Adiciona 'selecionado' ao dia clicado
                diaElemento.classList.add('selecionado');

                // Atualiza a lista de horários
                atualizarHorarios(dataCompleta);
            });

            diasGridElemento.appendChild(diaElemento);
        }
        
        // 3. (Opcional) Preenche os dias do próximo mês (para completar o grid)
        // ... (pode ser adicionado se necessário)
    }

    // --- [ 3. FUNÇÃO: ATUALIZAR HORÁRIOS (SIMULAÇÃO) ] ---
    function atualizarHorarios(data) {
        // Formata a data para o título (ex: 11/11/2025)
        const diaFormatado = data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
        horariosTitulo.textContent = `Horários para ${diaFormatado}`;
        
        // Limpa a lista de horários anterior
        horariosLista.innerHTML = '';

        // *** AQUI ENTRA O BACK-END ***
        // No futuro, aqui você faria uma chamada (fetch) ao back-end
        // perguntando: "Quais os horários para o dia ${data}?"
        
        // Por enquanto, vamos SIMULAR os dados:
        const horariosSimulados = [
            { hora: '09:00', pet: 'Max (Golden)', servico: 'Banho e Tosa', vago: false },
            { hora: '10:30', pet: 'Luna (Poodle)', servico: 'Banho', vago: false },
            { hora: '14:00', pet: 'Horário Vago', servico: '', vago: true },
            { hora: '15:00', pet: 'Horário Vago', servico: '', vago: true },
        ];

        if (data.getDay() === 0) { // Domingo
             horariosLista.innerHTML = '<p>Estamos fechados aos domingos.</p>';
             return;
        }

        horariosSimulados.forEach(item => {
            const itemElemento = document.createElement('div');
            itemElemento.classList.add('agendamento-item');
            
            if (item.vago) {
                itemElemento.classList.add('vago');
                itemElemento.innerHTML = `
                    <span class="hora">${item.hora}</span>
                    <span class="nome-pet">${item.pet}</span>
                `;
                
                // Adiciona evento de clique para preencher o formulário
                itemElemento.addEventListener('click', () => {
                    preencherFormulario(data, item.hora);
                });
            } else {
                itemElemento.innerHTML = `
                    <span class="hora">${item.hora}</span>
                    <span class="nome-pet">${item.pet}</span>
                    <span class="servico">${item.servico}</span>
                `;
            }
            horariosLista.appendChild(itemElemento);
        });
    }
    
    // --- [ 4. FUNÇÃO: PREENCHER O FORMULÁRIO ] ---
    function preencherFormulario(data, hora) {
        // Formata a data para "YYYY-MM-DD" (que o input type="date" usa)
        const dataISO = data.toISOString().split('T')[0];
        
        formInputData.value = dataISO;
        formInputHora.value = hora;
        
        // Foca no primeiro campo do formulário
        document.getElementById('nome-pet').focus();
        
        // Rola a página até o formulário
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- [ 5. EVENTOS DOS BOTÕES E FORMULÁRIO ] ---

    // Botão de "Mês Anterior"
    mesAnteriorBtn.addEventListener('click', () => {
        dataAtual.setMonth(dataAtual.getMonth() - 1);
        renderizarCalendario();
    });

    // Botão de "Próximo Mês"
    proximoMesBtn.addEventListener('click', () => {
        dataAtual.setMonth(dataAtual.getMonth() + 1);
        renderizarCalendario();
    });
    
    // Evento de "submit" do formulário
    form.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Impede o recarregamento da página
        
        // Aqui é onde o seu JS vai entregar os dados para o back-end
        const dadosDoForm = new FormData(form);
        const dados = Object.fromEntries(dadosDoForm.entries());
        
        console.log("Dados prontos para enviar ao Back-end:", dados);
        alert("Agendamento enviado com sucesso! (Simulação)");
        
        // Limpa o formulário (ou atualiza a lista de horários)
        form.reset();
        // Atualiza a lista de horários (simulação)
        // (Aqui você chamaria a função para recarregar os horários do dia)
    });

    // --- [ 6. INICIALIZAÇÃO ] ---
    renderizarCalendario();
});