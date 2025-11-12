// main.js - Tabs interativas (com logs de debug)
(function () {
    // Protege caso o script carregue antes do DOM (segurança extra)
    function initTabs() {
        console.log('[Tabs] Inicializando...');

        const tabBotoes = document.querySelectorAll('.tab-botao');
        const tabPaineis = document.querySelectorAll('.tab-painel');

        console.log(`[Tabs] Encontrados ${tabBotoes.length} botão(ões) e ${tabPaineis.length} painel(is).`);

        if (!tabBotoes.length || !tabPaineis.length) {
            console.warn('[Tabs] Não foram encontrados botões ou painéis. Verifique as classes no HTML.');
            return;
        }

        tabBotoes.forEach(botao => {
            botao.addEventListener('click', () => {
                const targetId = botao.dataset.target;
                if (!targetId) {
                    console.warn('[Tabs] Botão sem data-target:', botao);
                    return;
                }

                const targetPainel = document.getElementById(targetId);
                if (!targetPainel) {
                    console.warn(`[Tabs] Nenhum painel com id="${targetId}" foi encontrado.`);
                    return;
                }

                // Remove ativo de todos
                tabBotoes.forEach(b => b.classList.remove('ativo'));
                tabPaineis.forEach(p => p.classList.remove('ativo'));

                // Adiciona ativo ao clicado
                botao.classList.add('ativo');
                targetPainel.classList.add('ativo');

                console.log(`[Tabs] Ativado: ${targetId}`);
            });
        });

        console.log('[Tabs] Pronto.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTabs);
    } else {
        initTabs();
    }
})();