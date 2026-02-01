# Estratégia de Validação: POC Scraper Shopee

| Versão | Data | Autor | Status |
|--------|------|-------|--------|
| 1.0 | 31/01/2026 | Time BMad (Party Mode) | Aprovado |

---

## 1. Contexto da Decisão

Antes de investir semanas no desenvolvimento completo da "Plataforma de Gestão de Bots de Afiliação", o stakeholder optou por **validar a viabilidade técnica do scraping** através de um POC (Proof of Concept) de 2 semanas.

### 1.1 Objetivo
> Validar que conseguimos extrair dados de produtos da Shopee de forma estável por pelo menos 2 semanas, usando a arquitetura de stealth proposta (Playwright Patched).

### 1.2 Racional
- Scraping é a parte mais frágil e arriscada do projeto
- Stakeholder não tem experiência prévia com scraping
- Melhor validar antes de construir infraestrutura completa

---

## 2. Escopo do POC

### 2.1 Incluído ✅
| Componente | Descrição |
|------------|-----------|
| Scraper Shopee Básico | Buscar produtos por palavra-chave (ex: "whey protein") |
| Playwright Stealth | Usar `patchright` ou `rebrowser-playwright` |
| Extração de Dados | Título, Preço Original, Preço Atual, Desconto %, URL |
| Logging Estruturado | Arquivo JSON/TXT com resultados de cada execução |
| Health Check | Script que valida se scraper ainda funciona |
| Agendamento | Windows Task Scheduler ou cron (2-3x ao dia) |

### 2.2 Excluído ❌
| Componente | Motivo |
|------------|--------|
| Painel Web | Não necessário para validar scraping |
| Banco de Dados | Arquivos JSON são suficientes |
| Telegram Bot | Foco é scraping, não postagem |
| AliExpress | Validar um site primeiro |
| Docker | Rodar localmente é suficiente |
| Proxies | Testar primeiro sem; adicionar se bloqueado |

---

## 3. Stack Técnica do POC

```
- Runtime: Node.js 20 LTS
- Scraping: patchright (playwright patched) 
- Linguagem: JavaScript/TypeScript
- Logs: Arquivos JSON + Console
- Agendamento: Windows Task Scheduler
```

---

## 4. Critérios de Sucesso

| Critério | Métrica | Threshold Mínimo |
|----------|---------|------------------|
| Taxa de Sucesso | % execuções com dados válidos | ≥ 80% |
| Estabilidade | Dias consecutivos sem falha total | ≥ 7 dias |
| Sobrevivência | POC funciona após 2 semanas | Sim |
| Capacidade de Correção | Tempo para corrigir se quebrar | ≤ 4 horas |
| Dados Extraídos | Produtos válidos por execução | ≥ 5 produtos |

---

## 5. Critérios de Falha (Red Flags)

| Sinal | Indicador | Ação |
|-------|-----------|------|
| 🔴 Bloqueio Frequente | Bloqueado 3+ vezes em 1 semana | Investigar estratégia de stealth |
| 🔴 Taxa Baixa | Sucesso < 50% | Revisar seletores, timing |
| 🔴 Dados Incorretos | Preços/títulos errados > 20% | Revisar extração |
| 🔴 Correção Demorada | > 8h para corrigir uma falha | Reavaliar complexidade |

Se múltiplos red flags ocorrerem, considerar **Pivot para APIs Oficiais** (Caminho C).

---

## 6. Cronograma (2 Semanas)

### Semana 1: Desenvolvimento + Deploy
| Dia | Atividade | Entregável |
|-----|-----------|------------|
| 1 | Setup Node.js + Playwright | Ambiente funcionando |
| 2 | Implementar patchright/stealth | Navegador não detectado |
| 3 | Scraper Shopee v1 | Extrai 10 produtos com sucesso |
| 4 | Health Check + Logging | Sistema de monitoramento |
| 5 | Agendamento automático | Rodando 3x/dia sozinho |
| 6-7 | Buffer/Correções | Ajustes finos |

### Semana 2: Monitoramento
| Dia | Atividade | Métrica |
|-----|-----------|---------|
| 8-14 | Observação passiva | Registrar todas execuções |
| 14 | Análise final | Decisão GO/NO-GO |

---

## 7. Estrutura de Arquivos do POC

```
poc-shopee-scraper/
├── src/
│   ├── scraper.js        # Lógica principal de scraping
│   ├── health-check.js   # Validação de funcionamento
│   └── config.js         # Palavras-chave, intervalos
├── logs/
│   └── YYYY-MM-DD.json   # Log diário de execuções
├── output/
│   └── products.json     # Produtos extraídos (última execução)
├── package.json
└── README.md
```

---

## 8. Template de Log

```json
{
  "date": "2026-02-01",
  "executions": [
    {
      "time": "06:00:00",
      "status": "success",
      "keyword": "whey protein",
      "productsFound": 15,
      "duration_ms": 45000,
      "errors": []
    },
    {
      "time": "14:00:00",
      "status": "partial",
      "keyword": "whey protein", 
      "productsFound": 8,
      "duration_ms": 62000,
      "errors": ["Timeout on page 2"]
    }
  ],
  "dailySummary": {
    "totalExecutions": 2,
    "successRate": "100%",
    "totalProducts": 23
  }
}
```

---

## 9. Decisão Final (Dia 14)

### GO ✅
Se os critérios de sucesso forem atingidos:
- Prosseguir com desenvolvimento completo
- Usar aprendizados do POC na arquitetura final
- Iniciar Semana 1 do MVP (conforme PRD)

### NO-GO ❌
Se múltiplos critérios de falha ocorrerem:
- Documentar aprendizados
- Avaliar alternativas:
  - [ ] Tentar AliExpress em vez de Shopee
  - [ ] Investir em proxies residenciais
  - [ ] Pivotar para APIs oficiais
  - [ ] Reavaliar viabilidade do projeto

---

## 10. Próximos Passos Imediatos

1. [ ] Configurar ambiente Node.js local
2. [ ] Instalar e testar `patchright` 
3. [ ] Criar primeiro script de scraping
4. [ ] Executar manualmente e validar dados
5. [ ] Configurar agendamento automático
6. [ ] Monitorar por 14 dias
7. [ ] Analisar resultados e decidir

---

*Documento aprovado em Party Mode por: Mary, John, Winston, Sally, Bob, Murat*
