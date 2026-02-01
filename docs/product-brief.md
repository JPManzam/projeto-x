# Product Brief: Plataforma de Gestão de Bots de Afiliação

## 1. Visão Executiva
Uma plataforma centralizada ("Torre de Controle") para implantar, gerenciar e escalar uma frota de bots de Telegram especializados em vendas de afiliados (Amazon). O sistema elimina a necessidade de intervenção técnica diária, permitindo que o gestor foque na estratégia de nicho e maximização de lucro (Royalty).

## 2. O Problema
- **Escalabilidade Limitada:** Gerenciar múltiplos bots via arquivos de configuração (`.env`, JSON) é propenso a erros e lento.
- **Falta de Identidade:** Bots genéricos não convertem bem. Cada nicho (Fitness, Tech, etc.) exige uma linguagem ("Persona") específica.
- **Risco Operacional:** Promoções com descontos absurdos (erros de preço) podem gerar posts automáticos indesejados ou banimentos.
- **Limitações de API:** A Amazon impõe limites rigorosos de requisições, exigindo controle granular de *rate limiting* por bot.

## 3. A Solução
Um ecossistema composto por um **Painel Administrativo Web** e **Workers (Bots)** independentes.
- **No-Code Management:** Criação/edição de bots, definição de horários e palavras-chave via interface visual.
- **Smart Profit Engine:** Algoritmo que prioriza produtos com maior comissão (Royalty) e valida descontos.
- **Segurança de Marca:** Trava manual para descontos suspeitos (>80%).
- **Personas Dinâmicas:** O bot adota o tom de voz do nicho (ex: "Bora treinar!" para Fitness).

## 4. Público Alvo
- Empreendedores Digitais e Afiliados Profissionais que gerenciam múltiplas comunidades no Telegram e desejam escalar operações sem aumentar a complexidade técnica.

## 5. Princípios Chave do Produto
1.  **Lucro Primeiro:** O foco não é apenas "volume de ofertas", mas "volume de comissão".
2.  **Autonomia Segura:** O sistema roda sozinho, mas pede ajuda (alerta) quando algo parece bom demais para ser verdade.
3.  **Identidade de Nicho:** Cada bot deve parecer um curador humano especializado.

## 6. Escopo Inicial (MVP)
- **Integração:** Amazon (Scraping/API) + Telegram.
- **Painel:** Dashboard de Status, CRUD de Bots, Configuração de Chaves API.
- **Bot Engine:** Loop de varredura configurável (8h/12h/24h), filtro de Royalty, filtro de segurança (>80%).
- **Infra:** Docker ready para Oracle Cloud ARM64.

## 7. Critérios de Sucesso
- **Técnico:** Bots respeitando limites de requisição da Amazon (zero bloqueios por rate limit).
- **Negócio:** Capacidade de lançar um novo bot de nicho em < 5 minutos via painel.
- **Usuário:** Aumento na taxa de conversão (cliques/vendas) devido à linguagem adaptada da Persona.
