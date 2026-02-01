# Product Requirements Document (PRD): Plataforma de Gestão de Bots de Afiliação

| Versão | Data | Autor | Status |
| :--- | :--- | :--- | :--- |
| 1.1 | 31/01/2026 | Mary (Business Analyst) | Validado |
| 1.2 | 31/01/2026 | Mary (Business Analyst) | Atualizado (Stealth & Infra) |
| 1.3 | 31/01/2026 | Mary (Business Analyst) | Consolidado (Proxies, Spintax, KPIs) |
| 1.4 | 01/02/2026 | Mary (Business Analyst) & Sally (UX) | 

**Atualizado (Alinhamento UX/UI Fluent)** |

## 1. Introdução

### 1.1 Propósito
Criar uma plataforma centralizada ("Painel de Controle") para gerenciar múltiplos bots de Telegram focados em afiliação (Shopee, AliExpress e futuramente Amazon), permitindo operação escalável, segura e orientada a lucro sem necessidade de intervenção em código.

### 1.2 Objetivos de Negócio
- **Maximizar Lucro:** Priorizar produtos com maior comissão (Shopee/AliExpress) em vez de apenas volume.
- **Eficiência Operacional:** Reduzir tempo de configuração de novos bots de horas para minutos.
- **Mitigação de Risco:** Prevenir banimentos e propagação de erros de preço através de travas de segurança.

### 1.3 Métricas de Sucesso (KPIs)
- **Zero Bloqueios:** Nenhum bot bloqueado por exceder limites de API (Rate Limits) ou bloqueado pelos sites alvo (anti-bot).
- **Uptime:** Bots ativos e varrendo conforme agendamento em 99% do tempo.
- **Conversão:** Aumento na taxa de cliques devido ao uso inteligente de Templates de Persona por nicho.

---

## 2. Personas do Usuário

### 2.1 O Gestor de Afiliados (Admin)
- **Perfil:** Empreendedor digital que gerencia múltiplas comunidades (Fitness, Tech, Casa).
- **Dor:** Perde tempo editando arquivos `.env` e reiniciando processos para mudar uma estratégia. Tem medo de banimentos por excesso de requisições.
- **Necessidade:** Visão unificada de "quem está rodando", controle fácil de horários e aprovação visual de promoções perigosas.

---

## 3. Requisitos Funcionais

### 3.1 Painel de Controle (Web)
| ID | Funcionalidade | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **FR-01** | Dashboard de Status | Visualização (Home) com widgets de resumo: Aprovações Pendentes e Performance Gráfica. | P0 (MVP) |
| **FR-02** | CRUD de Bots | Gerenciamento em Lista (Data Grid) com status, última varredura e ações rápidas (Pausar/Excluir). | P0 (MVP) |
| **FR-03** | Configuração de Agendamento | Definir intervalo de varredura por bot (ex: 8h, 12h, 24h) para controle de requisições. | P0 (MVP) |
| **FR-04** | Gestão de Credenciais | Interface segura para inserir credenciais (Login Shopee/Ali, Tokens de Bot). | P0 (MVP) |
| **FR-05** | Approval Center | Grid visual de produtos com desconto > 80% (trava de segurança). Permite seleção múltipla para Aprovar/Rejeitar. | P0 (MVP) |
| **FR-06** | Analytics Básico | Gráfico de cliques por link/bot (integração futura com encurtador ou analytics do telegram). | P1 |
| **FR-06b** | Gestão de Proxies | Interface para adicionar e rotacionar proxies residenciais/4G. Obrigatório para evitar bloqueio de IP do Data Center Oracle. | P0 (MVP) |

### 3.2 Motor de Busca e Postagem (Backend/Workers)
| ID | Funcionalidade | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **FR-07** | Scraping Híbrido (Stealth) | Motor de busca utilizando **Playwright com Patches (ex: patchright/rebrowser)** para evasão avançada de detecção. Deve rodar nativo em ARM64. Suporte a rotação de User-Agents. | P0 (MVP) |
| **FR-08** | Algoritmo de Lucro | Ordenar resultados priorizando comissão e desconto. | P0 (MVP) |
| **FR-09** | Trava de Segurança | SE desconto > 80% ENTÃO não postar -> enviar para Fila de Aprovação (FR-05). Se não aprovado em 12h -> Descartar. | P0 (MVP) |
| **FR-13** | Controle de Fluxo (Throttling & Jitter) | Implementar fila com atraso ALEATÓRIO (Jitter). **Limites Rígidos:** Max 20 msgs/min por grupo. Política "Slow & Steady": Scan de 1 produto a cada 15-30s + tempo randômico extra (2-5s) para emular humano. | P0 (MVP) |
| **FR-14** | Política de Logs | Auto-limpeza de logs: Logs `DEBUG/INFO` duram 24h. Logs `ERROR/SALES` duram 30 dias. Previne estouro de disco na VM Free. | P0 (MVP) |
| **FR-15** | Monitor de Conversão | Se (Cliques / Dias) > X mas Vendas == 0 por 72h -> Pausar Bot e Alertar Admin. (Proteção contra bloqueio em programas de afiliados). | P1 |

---

## 4. Requisitos Não-Funcionais

### 4.1 Infraestrutura e Desempenho
- **Arquitetura:** Microserviços baseados em Filas (Redis/BullMQ) para desacoplar Scraping de Postagem.
- **Compatibilidade:** Obrigatório uso de **Playwright** para garantir execução nativa em **ARM64** (Oracle Cloud Ampere) sem emulação.
- **Persistência:** Banco de dados relacional (Postgres) ou NoSQL (MongoDB) para guardar configurações e histórico de aprovações.

### 4.2 Segurança
- As credenciais devem ser armazenadas de forma segura (encripitadas).
- Painel protegido por login/senha básico (Auth).

---

## 5. User Interface (UI) - Diretrizes

**Fonte da Verdade:** `docs/ux-design.md`

### 5.1 Conceito Visual
- **Design System:** **Microsoft Fluent Design 2** (Estilo Windows 11 Nativo).
- **Filosofia:** "Familiaridade e Memória Muscular". A aplicação deve parecer uma extensão nativa do SO.
- **Materiais:** Uso extensivo de efeito **Mica** (fundo translúcido adaptativo) e **Acrylic**.
- **Cores:** Paleta sóbria baseada em *Windows Blue* (`#0067C0`) apenas para ações. Fundo adaptativo ao tema (Light/Dark).

### 5.2 Componentes e Layout
- **Navegação:** Pane Lateral Esquerda (Navigation Pane) padrão.
- **Tipografia:** `Segoe UI Variable` (Fonte nativa do Windows).
- **Ícones:** `Fluent System Icons` (Lineares).
- **Feedback:** Sutileza é chave. Badges e status devem ser minimalistas (dots coloridos, não etiquetas gritantes).

### 5.3 Telas Principais
1.  **Home (Dashboard):** Seção Hero com saudação e widgets de resumo (Aprovações pendentes, Performance). Estilo "Configurações do Windows".
2.  **Lista de Bots:** Data Grid (Tabela) limpa, semelhante ao Gerenciador de Arquivos (Modo Detalhes).
3.  **Approval Center:** Grid de imagens (Galeria) com seleção múltipla (checkboxes estilo Windows Explorer) e barra de ações flutuante.
4.  **Configurações:** Layout idêntico ao painel de configurações do sistema operacional.

---

## 6. Plano de Lançamento

### Fase 0: POC de Validação (2 semanas) ⚠️ NOVA
> **Objetivo:** Validar viabilidade do scraping antes de investir no MVP completo
> **Documento:** `poc-validation-strategy.md`

| Semana | Atividade | Critério de Sucesso |
|--------|-----------|---------------------|
| 0.1 | Desenvolvimento do POC Scraper Shopee | Script funcionando localmente |
| 0.2 | Monitoramento e Validação | Taxa de sucesso ≥80%, sobreviver 7+ dias |

**Decisão no Dia 14:**
- ✅ GO → Iniciar MVP (Semanas 1-4)
- ❌ NO-GO → Reavaliar estratégia (ver documento de validação)

---

### MVP (4 semanas) - Após Validação do POC
1.  **Semana 1:** Ambiente Docker ARM64 + Motor de Scraping (Playwright) para Shopee/AliExpress.
2.  **Semana 2:** Backend de Filas (Throttling) + Integração Telegram Bot.
3.  **Semana 3:** Frontend (Fluent UI React) + Integração com Backend.
4.  **Semana 4:** Testes de Carga (Rate Limits) + Deploy Oracle Cloud.

## 7. Questões Resolvidas
| Questão | Decisão |
|---------|---------|
| Ferramenta de Scraping | ✅ **Playwright (Patched/Stealth)** - Docker ARM64 oficial |
| Framework de UI | ✅ **Fluent UI React v9** (Microsoft) - Substituiu a ideia inicial |
| Estilo Visual | ✅ **Windows 11 Mica/Native** - Substituiu "Cyberpunk" |
| Sintaxe de Templates | ✅ **Spintax** - Simplicidade para MVP, migração para OpenAI na Fase 3 |
| Tracking de Cliques | ✅ **Telegram Analytics** nativo |

---

## 8. Estratégia de Proxies (Zero-Cost MVP)

### 8.1 Problema
IPs de Data Center (Oracle Cloud) são **detectados e bloqueados** instantaneamente por Shopee/AliExpress.

### 8.2 Solução MVP: Túnel Residencial
Roteamento de tráfego de scraping via rede doméstica do operador.

**Arquitetura:**
```
[Oracle Cloud ARM64] --(SSH Tunnel)--> [Raspberry Pi/PC Casa] --(Internet Residencial)--> [Shopee/Ali]
```

**Componentes:**
- **Servidor Proxy Local:** `tinyproxy` ou `3proxy` rodando em hardware doméstico
- **Túnel Reverso SSH:** Conexão persistente Oracle → Casa
- **Failover:** Se túnel cair, pausar scraping automaticamente

### 8.3 Configuração Recomendada
| Parâmetro | Valor |
|-----------|-------|
| Frequência de Scraping | 2-3x ao dia (Low & Slow) |
| Horários Preferidos | 06h, 14h, 22h (variação humana) |
| Jitter entre Requests | 15-30s + random(2-5s) |
| Rotação User-Agent | A cada sessão de scraping |

### 8.4 Roadmap de Proxies
- **MVP:** Túnel residencial (custo zero)
- **Escala:** Proxies 4G caseiros (R$150-300 custo único)
- **Produção:** Proxies residenciais pagos quando houver lucro recorrente

---

## 9. Sistema de Personas (Spintax MVP)

### 9.1 Formato
Templates Spintax geram variações automáticas para evitar detecção de bot.

**Exemplo de Template Fitness:**
```
{Olá|Oi|E aí} {pessoal|galera|turma}! 🏋️
{Achei|Encontrei|Descobri} {uma oferta|um desconto|uma promoção} {incrível|imperdível|absurda}!

{💪|🔥|⚡} **{PRODUTO}**
{De|Era} ~~R$ {PRECO_ORIGINAL}~~ {por|agora|só} **R$ {PRECO_ATUAL}**
{Desconto de|Economia de|-} **{DESCONTO}%**!

{Corre lá|Aproveita|Bora|Garanta o seu}: {LINK}
```

### 9.2 Requisitos de Variação
- **Mínimo:** 30 variações únicas por template (cobertura mensal)
- **Rotação:** Sistema deve evitar repetir a mesma variação em 24h
- **Personalização por Nicho:** Cada bot terá seu próprio banco de templates