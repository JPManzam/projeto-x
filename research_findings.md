# Relatório de Pesquisa Técnica: Bots de Afiliação (Shopee/AliExpress)

## 1. Viabilidade Técnica: Playwright em ARM64 (Oracle Cloud)
**Veredito:** ✅ **VIÁVEL (Com ressalvas)**

### 1.1 Compatibilidade ARM64
*   **Playwright:** Suporte nativo confirmado para Linux ARM64 (Ubuntu 20.04+, Debian 10+).
*   **Oracle Cloud (Ampere A1):** Funciona perfeitamente. O processador Ampere (ARM base) é suportado.
*   **Docker:** Imagens oficiais `mcr.microsoft.com/playwright` são "multi-arch", ou seja, o Docker baixará automaticamente a versão correta (`arm64`) sem configuração extra.

### 1.2 Stack Recomendada
Para garantir funcionamento sem "dor de cabeça" no Oracle Cloud Free Tier:
*   **OS:** Ubuntu 22.04 LTS (ARM64).
*   **Docker Base Image:** `mcr.microsoft.com/playwright:v1.41.0-jammy` (Exemplo).
*   **Node.js:** Versão 18 ou 20 (LTS).

---

## 2. Análise de Risco e Conformidade (Termos de Uso)
**Veredito:** ⚠️ **ALTO RISCO (Área Cinzenta/Proibida)**

### 2.1 Shopee
*   **Política:** Proíbe EXPLICITAMENTE "robots, spiders, scripts" e métodos de "extração de dados" (Scraping).
*   **Detecção:** Utiliza Machine Learning comportamental e análise de `TLS/JA3 Fingerprints`.
*   **Consequência:** Banimento da conta de afiliado e bloqueio de IP.

### 2.2 AliExpress
*   **Política:** Proíbe ações que "minem a integridade do sistema". Scraping agressivo se enquadra aqui.
*   **Caminho Oficial:** Possui API oficial (Open Platform), mas o acesso é restrito e burocrático. Acesso de "pesquisador" (DSA) existe mas não se aplica a bots comerciais.

---

## 3. Estratégia de Mitigação ("Stealth Mode")
Para operar sem ser detectado, não basta apenas "rodar o script". Precisamos de Engenharia de Evasão.

### 3.1 Nível 1: Básico (Obrigatório)
*   User-Agent Rotativo (Mobile e Desktop).
*   **Throttling:** Intervalos aleatórios entre ações (ex: `wait(random(2000, 5000))`). Nunca usar tempos fixos.

### 3.2 Nível 2: Plugins de Stealth (Recomendado)
*   **Evitar:** `playwright-stealth` padrão (está ficando datado/detectável).
*   **Adotar:** Explorar **`patchright`** ou **`rebrowser-playwright`** (versões patcheadas do Playwright que removem flags de automação a nível de binário).
    *   *Por que?* O Playwright padrão vaza a variável `navigator.webdriver = true`. Plugins simples tentam esconder isso via JS, mas sites avançados detectam a "tentativa de esconder". O `patchright` remove isso no código fonte do navegador.

### 3.3 Nível 3: Infraestrutura (Investimento Futuro)
*   **Proxies Residenciais:** Se usar o IP do Data Center da Oracle, será bloqueado instantaneamente pela Shopee.
    *   *Solução:* Roteamento de tráfego via Proxy Residencial (custo extra) ou 4G Mobile Proxy.

## 4. Recomendações para o PRD (Atualização)

1.  **Atualizar FR-07 (Scraping):** Adicionar menção explícita a `patchright` ou `undetected-playwright` como alternativa se o padrão falhar.
2.  **Novo Requisito (Infra):** **Gestão de Proxies**. O sistema precisa suportar autenticação em proxies rotativos. Sem isso, o `FR-13 (Controle de Fluxo)` será inútil, pois o bloqueio será por IP, não por volume.
3.  **Reforçar FR-13:** Implementar "Jitter" (Atraso Aleatório) em todas as interações.
