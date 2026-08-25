(function () {
  'use strict';

  window.NOHALL_READY_CONFIG = Object.freeze({
    commercial: Object.freeze({
      currency: 'BRL',
      locale: 'pt-BR',
      pricePrefix: 'a partir de',
      visible: true,
      provisional: true,
      provisionalLabel: 'Valores referenciais provisórios',
      note: 'Estimativas para uma unidade compacta de referência. O orçamento final varia conforme metragem, padrão, cidade, escopo e condições do imóvel.',
      packages: Object.freeze({
        essential: 39900,
        performance: 59900,
        premium: 84900
      })
    }),
    actions: Object.freeze({
      quote: Object.freeze({
        available: false,
        futureUrl: 'https://portal.nohallempreendimentos.com.br/cotacao',
        fallbackUrl: '/contato.html?origem=ready',
        label: 'Solicitar orçamento'
      }),
      client: Object.freeze({
        available: false,
        futureUrl: 'https://portal.nohallempreendimentos.com.br/login?return_to=/portal',
        fallbackUrl: '/acesso.html#cliente',
        label: 'Acessar minha conta'
      }),
      supplier: Object.freeze({
        available: false,
        futureUrl: 'https://portal.nohallempreendimentos.com.br/fornecedor',
        fallbackUrl: '/acesso.html#fornecedor',
        label: 'Sou fornecedor'
      })
    })
  });
})();
