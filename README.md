# EcoTrend — Check-Point 04

E-commerce de produtos sustentáveis desenvolvido em React para o Check-Point 04 da disciplina **Web Development with JavaScript**, do curso de Engenharia de Software da FIAP.

## Integrantes

| Nome | RM |
|---|---:|
| Eduardo Bechara Medeiros Craveiro | 571081 |
| Gustavo Moita de Lima | 569180 |
| Bruno Carreiro dos Santos | 569423 |

## Funcionalidades

- catálogo carregado de `public/products.json` por `fetch`;
- loading spinner e tratamento de erro durante a requisição;
- busca e filtros dinâmicos por categoria e preço;
- carrinho lateral com inclusão, remoção e alteração de quantidade;
- persistência do carrinho entre sessões por `localStorage`;
- checkout simulado com validação, `Promises` e `async/await`;
- feedback assíncrono de processamento, sucesso e erro;
- interface responsiva para desktop, tablet e celular;
- ícones Font Awesome e tipografia Google Fonts.

## Como executar

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

O `vite.config.js` define automaticamente a base `/CP4-WebDev/` durante o workflow do GitHub Actions e mantém `./` no build local.

## Estrutura principal

- `src/App.jsx`: componentes, estado, filtros, carrinho e checkout;
- `src/styles.css`: identidade visual e responsividade;
- `public/products.json`: dados do catálogo consumidos via Fetch.

## Entrega

- **Aplicação:** https://webdevelopment-fiap.github.io/CP4-WebDev/
- **Repositório:** https://github.com/WebDevelopment-FIAP/CP4-WebDev
