# Contexto do Projeto: Sistema de Bots de Afiliação Multi-Nicho

## 1. Visão Geral do Projeto
**Conceito:** Uma plataforma centralizada (Painel de Controle) para gerenciar, configurar e implantar múltiplos bots de vendas via Telegram.
**Objetivo Principal:** Automatizar a busca e divulgação de ofertas da Shopee e AliExpress (e futuramente Amazon) maximizando o lucro através de filtros inteligentes de "Maior Desconto" + "Maior Royalt/Comissão".
**Valor de Negócio:** Escalar operações de afiliação permitindo a gestão de múltiplos nichos (ex: Fitness, Tech) sem necessidade de interação com código após o setup inicial.

## 2. Componentes Principais

### A. O "Motor" de Busca e Filtragem
- **Fonte Inicial:** Shopee e AliExpress (Estratégia "Scraping-First" para o MVP).
- **Tecnologia:** **Playwright** (suporte nativo ARM64) rodando em modo Headless "Low & Slow" para evitar detecção.
- **Lógica de Seleção:**
  - **Prioridade 1 (Ouro):** Maior Royalty (Comissão).
  - **Prioridade 2 (Isca):** Descontos Absurdos (ex: >80%).
    - *Regra de Exceção:* Se Desconto > 80%, **NÃO POSTAR AUTOMATICAMENTE**. Enviar alerta para o Painel aguardando aprovação humana (evitar erros de preço ou golpes).
  - **Filtros de Nicho:** Configuração de palavras-chave e categorias específicas por bot (ex: "Whey", "Halteres" para Bot Fitness).
  - Geração automática de Link de Afiliado.

### B. A "Torre de Controle" (Painel Administrativo)
- **Função:** Permitir que o gestor crie, monitore e edite bots sem mexer em código.
- **Funcionalidades Chave:**
  - **Gestão de Bots:** Criar Bot A (Fitness), Bot B (Tech).
  - **Status em Tempo Real:** Dashboard visual indicando se o bot está "Varrendo", "Aguardando", "Postando" ou "Inativo/Erro".
  - **Controle de Fluxo (Throttling):** Fila inteligente de mensagens para respeitar os limites do Telegram (max 20 msgs/min por grupo).
  - **Mapeamento:** Bot A -> Busca produtos Fitness -> Posta no Grupo Telegram Fitness.
  - **Gestão de Credenciais:** Interface para inserir logins e tokens.
  - **Identidade e Persona:** Configurar nome e vincular a uma "Persona" baseada em Templates.
  - **Aprovação Manual:** Interface para aprovar "Promoções Absurdas" (ex: >80% desconto) antes de postar.
  - **Analytics:** Relatório de cliques.

### C. O Canal de Distribuição (Telegram)
- Bots independentes operando em canais/grupos específicos.
- Mensagens formatadas com link de afiliado e copy gerado pela persona do bot.

## 3. Usuário Alvo (Persona)
- Empreendedores digitais/Afiliados que gerenciam múltiplas comunidades.
- Necessitam de eficiência e não querem editar arquivos de configuração (.env ou JSON) manualmente para cada mudança.

## 4. Requisitos Técnicos Iniciais
- **Frontend (Painel):** Interface web moderna e responsiva.
- **Backend:** API robusta (Node.js ou Python) com filas de tarefas (Redis/Bull) obrigatórias para gestão de rate limits.
- **Crawler:** **Playwright** (Mandatório para suporte ARM64 na Oracle Cloud).
- **Banco de Dados:** Postgres ou MongoDB para configurações, logs e analytics.
- **Infraestrutura:** Docker (Containerização completa) para deploy na Oracle Cloud (ARM 64).

## 5. Roadmap Sugerido (MVP vs Futuro)
- **Fase 1 (MVP):** Motor de Scraping Playwright + Telegram + Painel Web Básico. Foco em estabilidade e anti-ban.
- **Fase 2:** Integração via APIs Oficiais (quando aprovadas) + Integração Amazon + Analytics Avançado.
- **Fase 3:** IA (OpenAI) para variação de copy (texto de vendas) após geração de caixa.


## 1. Visão Geral do Projeto
**Conceito:** Uma plataforma centralizada (Painel de Controle) para gerenciar, configurar e implantar múltiplos bots de vendas via Telegram.
**Objetivo Principal:** Automatizar a busca e divulgação de ofertas da Shopee e AliExpress (e futuramente Amazon) maximizando o lucro através de filtros inteligentes de "Maior Desconto" + "Maior Royalt/Comissão".
**Valor de Negócio:** Escalar operações de afiliação permitindo a gestão de múltiplos nichos (ex: Fitness, Tech) sem necessidade de interação com código após o setup inicial.

## 2. Componentes Principais

### A. O "Motor" de Busca e Filtragem
- **Fonte Inicial:** Shopee e AliExpress (via API oficial ou Scraping com Puppeteer Steath). Amazon movida para Fase 2 (estratégia de 3 vendas).
- **Lógica de Seleção:**
  - **Prioridade 1 (Ouro):** Maior Royalty (Comissão).
  - **Prioridade 2 (Isca):** Descontos Absurdos (ex: >80%).
    - *Regra de Exceção:* Se Desconto > 80%, **NÃO POSTAR AUTOMATICAMENTE**. Enviar alerta para o Painel aguardando aprovação humana (evitar erros de preço ou golpes).
  - **Filtros de Nicho:** Configuração de palavras-chave e categorias específicas por bot (ex: "Whey", "Halteres" para Bot Fitness).
  - Geração automática de Link de Afiliado.

### B. A "Torre de Controle" (Painel Administrativo)
- **Função:** Permitir que o gestor crie, monitore e edite bots sem mexer em código.
- **Funcionalidades Chave:**
  - **Gestão de Bots:** Criar Bot A (Fitness), Bot B (Tech).
  - **Status em Tempo Real:** Dashboard visual indicando se o bot está "Varrendo", "Aguardando", "Postando" ou "Inativo/Erro".
  - **Controle de Varredura (Rate Limiting):** Configuração granular por bot para definir intervalo de busca (ex: 8h, 12h, 24h) e limite de requisições diárias (para respeitar limites da Amazon API).
  - **Mapeamento:** Bot A -> Busca produtos Fitness -> Posta no Grupo Telegram Fitness.
  - **Gestão de API:** Interface para inserir/atualizar chaves de API (Amazon, Telegram, etc).
  - **Identidade e Persona:** Configurar nome e vincular a uma "Persona" baseada em Templates (Spintax/Mustache no MVP) que adapta o copy da mensagem.
  - **Aprovação Manual:** Interface para aprovar "Promoções Absurdas" (ex: >80% desconto) antes de postar, com expiração automática em 12h.
  - **Analytics:** Relatório de cliques e (futuramente) vendas para otimização de marketing.

### C. O Canal de Distribuição (Telegram)
- Bots independentes operando em canais/grupos específicos.
- Mensagens formatadas com link de afiliado e copy gerado pela persona do bot.

## 3. Usuário Alvo (Persona)
- Empreendedores digitais/Afiliados que gerenciam múltiplas comunidades.
- Necessitam de eficiência e não querem editar arquivos de configuração (.env ou JSON) manualmente para cada mudança.

## 4. Requisitos Técnicos Iniciais
- **Frontend (Painel):** Interface web moderna e responsiva.
- **Backend:** API robusta (Node.js/Python) com filas de tarefas (bull/redis) para gerenciar varreduras agendadas.
- **Banco de Dados:** Postgres ou MongoDB para configurações, logs e analytics.
- **Infraestrutura:** Docker (Containerização completa) para deploy na Oracle Cloud (ARM 64).
- **Integrações:** Amazon Product Advertising API, Telegram Bot API.

## 5. Roadmap Sugerido (MVP vs Futuro)
- **Fase 1 (MVP):** Integração Shopee + AliExpress + Telegram + Painel Web Básico (Templates).
- **Fase 2:** Integração Amazon (Meta: 3 vendas) + Analytics.
- **Fase 3:** IA (OpenAI) para variação de copy (texto de vendas) após geração de caixa.