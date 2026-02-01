# Product Requirements Document (PRD): Plataforma de Gestão de Bots de Afiliação

| Versão | Data | Autor | Status |
| :--- | :--- | :--- | :--- |
| 1.0 | 31/01/2026 | John (PM Agent) | Rascunho |

## 1. Introdução

### 1.1 Propósito
Criar uma plataforma centralizada ("Painel de Controle") para gerenciar múltiplos bots de Telegram focados em afiliação (Shopee, AliExpress e futuramente Amazon), permitindo operação escalável, segura e orientada a lucro sem necessidade de intervenção em código.

### 1.2 Objetivos de Negócio
- **Maximizar Lucro:** Priorizar produtos com maior comissão (Shopee/AliExpress) em vez de apenas volume.
- **Eficiência Operacional:** Reduzir tempo de configuração de novos bots de horas para minutos.
- **Mitigação de Risco:** Prevenir banimentos e propagação de erros de preço através de travas de segurança.

### 1.3 Métricas de Sucesso (KPIs)
- **Zero Bloqueios:** Nenhum bot bloqueado por exceder limites de API (Rate Limits).
- **Uptime:** Bots ativos e varrendo conforme agendamento em 99% do tempo.
- **Conversão:** Aumento na taxa de cliques devido ao uso inteligente de Templates de Persona por nicho.

---

## 2. Personas do Usuário

### 2.1 O Gestor de Afiliados (Admin)
- **Perfil:** Empreendedor digital que gerencia múltiplas comunidades (Fitness, Tech, Casa).
- **Dor:** Perde tempo editando arquivos `.env` e reiniciando processos para mudar uma estratégia. Tem medo de a Amazon banir sua conta por excesso de requisições.
- **Necessidade:** Visão unificada de "quem está rodando", controle fácil de horários e aprovação visual de promoções perigosas.

---

## 3. Requisitos Funcionais

### 3.1 Painel de Controle (Web)
| ID | Funcionalidade | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **FR-01** | Dashboard de Status | Visualização em cards de todos os bots com status: *Varrendo, Aguardando, Postando, Erro, Em Pausa*. | P0 (MVP) |
| **FR-02** | CRUD de Bots | Criar/Editar/Excluir bots. Configurar: Nome, Token Telegram, Channel ID, Persona (Templates/Spintax). | P0 (MVP) |
| **FR-03** | Configuração de Agendamento | Definir intervalo de varredura por bot (ex: 8h, 12h, 24h) para controle de requisições. | P0 (MVP) |
| **FR-04** | Gestão de Chaves API | Interface segura para inserir credenciais Amazon (Tag de Associado, Access Key, Secret) e Telegram. | P0 (MVP) |
| **FR-05** | Fila de Aprovação | Interface para listar produtos com desconto > 80% (trava de segurança) e permitir "Aprovar" ou "Rejeitar". Inclui TTL de 12h (expiração automática). | P0 (MVP) |
| **FR-06** | Analytics Básico | Gráfico de cliques por link/bot (integração futura com encurtador ou analytics do telegram). | P1 |

### 3.2 Motor de Busca e Postagem (Backend/Workers)
| ID | Funcionalidade | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **FR-07** | Integração Shopee/AliExpress | Conexão preferencial via APIs (se acessíveis) ou Scraping (Puppeteer) com stealth. | P0 (MVP) |
| **FR-08** | Algoritmo de Lucro | Ordenar resultados priorizando comissão e desconto. | P0 (MVP) |
| **FR-09** | Trava de Segurança | SE desconto > 80% ENTÃO não postar -> enviar para Fila de Aprovação (FR-05). Se não aprovado em 12h -> Descartar. | P0 (MVP) |
| **FR-13** | Controle de Fluxo (Cool Down) | O bot deve respeitar um intervalo MÍNIMO entre posts (ex: 20 min) independente do volume de ofertas encontradas. Ofertas excedentes ficam em fila. | P0 (MVP) |
| **FR-14** | Política de Logs | Auto-limpeza de logs: Logs `DEBUG/INFO` duram 24h. Logs `ERROR/SALES` duram 30 dias. Previne estouro de disco na VM Free. | P0 (MVP) |
| **FR-15** | Monitor de Conversão | Se (Cliques / Dias) > X mas Vendas == 0 por 72h -> Pausar Bot e Alertar Admin. (Proteção contra bloqueio em programas de afiliados). | P1 |

---

## 4. Requisitos Não-Funcionais

### 4.1 Infraestrutura e Desempenho
- **Arquitetura:** Microserviços ou Monolito Modular containerizado (Docker).
- **Compatibilidade:** Deve rodar nativamente em arquitetura **ARM64** (Oracle Cloud Ampere).
- **Persistência:** Banco de dados relacional (Postgres) ou NoSQL (MongoDB) para guardar configurações e histórico de aprovações.

### 4.2 Segurança
- As chaves de API devem ser armazenadas de forma segura (encripitadas no banco ou via secrets).
- Painel protegido por login/senha básico (Auth).

---

## 5. User Interface (UI) - Diretrizes
- **Estilo:** Dark Mode (Cyberpunk/Tech mood).
- **Feedback:** Indicadores visuais pulsantes para bots ativos.
- **Responsividade:** Painel deve funcionar bem em mobile para gestão em trânsito.

---

## 6. Plano de Lançamento (MVP)
1.  **Semana 1:** Setup ambiente Docker ARM64 (Oracle) + Backend Básico.
2.  **Semana 2:** Integração Shopee + AliExpress (Scraping/API) + Templates de Mensagem.
3.  **Semana 3:** Frontend (Dashboard + Config) + Integração.
4.  **Semana 4:** Testes de Carga (Rate Limits) + Deploy Oracle Cloud.

## 7. Questões em Aberto
- Qual biblioteca específica de Scraping usar se a API falhar? (Puppeteer/Playwright vs Cheerio).
- Definição da sintaxe dos Templates de Persona (Spintax ou Mustache?).
