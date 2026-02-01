# Estratégia de Execução: Walking Skeleton (Sprint 0)

## 1. O Conceito
Adotamos a abordagem **"Walking Skeleton"** (Esqueleto Andante).
**Meta:** Construir uma implementação minúscula, porém completa, de ponta a ponta, conectando todos os componentes arquiteturais vitais (Frontend, Backend, DB, Integrações) na primeira iteração.
**Não é:** Um protótipo descartável. É a fundação real do sistema, porém com funcionalidades mínimas e sem polimento visual.

## 2. Escopo da Entrega (Semana 1)

### Para o Luan (Tech Lead / Backend)
- **Infra:** Container Docker "Hello World" rodando na Oracle Cloud ARM64.
- **Backend:** API simples (Node.js/Python) com 1 endpoint: `POST /bots`.
- **Worker (Core):** Script manual que, ao ser invocado, busca 1 produto em oferta na Shopee/AliExpress e posta no Telegram.
- **DB:** Banco conectado salvando o token do bot.

### Para o Junior (Design / Frontend)
- **Interface:** Uma página HTML/React crua (sem CSS ou Design System).
- **Funcionalidade:** Um formulário com campo "Token Telegram" e um botão "Salvar".
- **Feedback:** Ao clicar, deve aparecer "Bot Salvo" (provando que o frontend falou com o backend).

### Para o João (PM / QA)
- **Validação:** Testar se, ao criar o bot na tela feia, a mensagem realmente chega no celular.
- **Critério de Sucesso:** "Cliquei no botão feio -> Bot postou Oi no Telegram".

## 3. Racional da Decisão
Escolhemos o Caminho C (Híbrido) para:
1.  **Eliminar Riscos de Integração:** Descobrir agora se a Oracle bloqueia a porta do Frontend ou se a Shopee/AliExpress bloqueiam o IP.
2.  **Paralelismo:** Permitir que Frontend e Backend evoluam juntos na próxima Sprint (Junior embeleza o HTML enquanto Luan melhora o Worker).
3.  **Moral da Equipe:** Ver o produto "vivo" na primeira semana é motivador.

## 4. Próximos Passos Imediatos
1.  **Arquitetura (Winston):** Definir a stack (Linguagem, BD) para suportar esse esqueleto.
2.  **Setup (Luan):** Criar o repositório e o Docker Compose.
