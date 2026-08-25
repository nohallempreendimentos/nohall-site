# Integração futura — NOHALL Ready

## Visão geral

A experiência pública está em `/ready` (`ready.html`). O gateway de acesso está em `/acesso` (`acesso.html`) e é deliberadamente informativo: ele não simula autenticação. Enquanto os portais não estiverem publicados, os fluxos comerciais terminam em rotas existentes do site.

Toda a configuração temporária está centralizada em `js/ready-config.js`. Nenhum preço ou endpoint futuro deve ser alterado diretamente no HTML.

## Endpoints e ativação

| Ação | URL futura | Fallback atual |
|---|---|---|
| Orçamento | `https://portal.nohallempreendimentos.com.br/cotacao` | `/contato.html?origem=ready` |
| Cliente | `https://portal.nohallempreendimentos.com.br/login?return_to=/portal` | `/acesso.html#cliente` |
| Fornecedor | `https://portal.nohallempreendimentos.com.br/fornecedor` | `/acesso.html#fornecedor` |

Para ativar um endpoint, publique e valide a rota, depois altere apenas `available` para `true` no item correspondente. `ready.js` passa automaticamente a usar `futureUrl`.

## Configuração comercial

`commercial.visible` controla a exibição da área de investimento. `commercial.provisional` aplica o selo de valor provisório. `packages` contém os valores numéricos em BRL; `locale`, `currency`, `pricePrefix`, `provisionalLabel` e `note` controlam a apresentação.

Antes da publicação de valores definitivos:

1. validar composição e margem dos três pacotes;
2. revisar impostos, praça, logística e limites de escopo;
3. atualizar os números em `packages`;
4. alterar `provisional` para `false` e revisar/remover o texto provisório;
5. executar QA visual nas cinco larguras do projeto.

## Contrato dos ativos finais

As imagens atuais em `images/ready/stock/` são temporárias e não devem ser apresentadas como projetos executados. Ao substituir os ativos, mantenha os nomes abaixo ou atualize todas as referências no HTML e nos metadados.

| Slot | Uso | Recomendação mínima |
|---|---|---|
| `hero-ready` | Hero da página | 2400 × 1600 px, interior compacto horizontal, área livre para tipografia |
| `studio-empty` | Transformação — vazio | 1800 × 1200 px, mesmo enquadramento dos demais estágios |
| `studio-marcenaria` | Transformação — marcenaria | 1800 × 1200 px, mesmo enquadramento |
| `studio-furnished` | Transformação — mobiliado | 1800 × 1200 px, mesmo enquadramento |
| `studio-rental-ready` | Transformação — rental ready | 1800 × 1200 px, mesmo enquadramento |
| `studio-essential` | Pacote Essential | 1600 × 1200 px |
| `studio-performance` | Pacote Performance | 1600 × 1200 px |
| `studio-premium` | Pacote Premium | 1600 × 1200 px |
| `ready-og` | Open Graph | 1200 × 630 px, JPG ou WebP, sem texto essencial nas bordas |

Para uma transformação visual contínua, os quatro estágios devem vir do mesmo ambiente, câmera e distância focal. Até isso existir, a interface usa transições editoriais discretas entre fotografias diferentes, sem insinuar um antes/depois real.

## Gateway e indexação

`acesso.html` usa `noindex, follow` e não deve entrar no sitemap enquanto for apenas um gateway. Quando autenticação e conteúdo próprio estiverem publicados, revisar o robots meta, canonical, segurança, estados de erro e acessibilidade antes de indexar.
