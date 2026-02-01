# UX/UI Design Specification: Plataforma de Gestão de Bots

> **Versão:** 2.0 (Final - Consolidada)
> **Status:** Aprovado para Desenvolvimento
> **Autor:** Sally (UX Designer Agent)
> **Referência Visual:** `docs/ux.png` (Light Mode)

---

## 1. Princípios de Design & Estética (UI)

O sistema deve seguir estritamente o **Windows 11 Fluent Design System** em modo **LIGHT**. A interface deve ser "invisível", parecendo uma ferramenta nativa do sistema operacional.

*   **Tema:** Light Mode (Fundo Cinza Claro `#F3F3F3` ou Mica).
*   **Superfícies (Cards):** Branco `#FFFFFF` com bordas arredondadas (`8px`) e sombra suave (`elevation-4`).
*   **Tipografia:** `Segoe UI Variable` (Preto `#000000` para títulos, `#5D5D5D` para secundários).
*   **Cor Primária (Ação):** Azure Blue `#0067C0` (Botões sólidos e estados ativos).
*   **Navegação:** Navigation Pane lateral (Esquerda), estilo "Configurações" do Windows.

---

## 2. Sitemap Estrutural

A estrutura expande o esqueleto inicial (Home) para incluir módulos de configuração detalhados.

```mermaid
graph LR
    A[Navigation Pane] --> B[Home / Dashboard]
    A --> C[Aprovações]
    A --> D[Meus Bots]
    
    D --> D1[Detalhes do Bot]
    D1 --> D1_A[Integrações (Credenciais)]
    D1 --> D1_B[Regras & Ciclos]
    D1 --> D1_C[Roteamento de Canais]
```

---

## 3. Detalhamento das Telas (Backlog de Frontend)

### 3.1. Home & Dashboard (Base Existente)
*Manter conforme implementação atual do Júnior (Referência: `ux.png`).*

### 3.2. Detalhes do Bot > Integrações (Novo)
*Objetivo: Configurar chaves de API com segurança.*

*   **Layout:** Dois Cards Brancos verticais.
*   **Card 1: Amazon Credentials**
    *   `Access Key ID` (Input Texto)
    *   `Secret Key` (Input Password - com botão mostrar/ocultar)
    *   `Associate Tag` (Input Texto)
*   **Card 2: Telegram Credentials**
    *   `Bot Token` (Input Password)
    *   Botão `Test Connection` (Estilo Primário Azul). Retorna mensagem de sucesso "Bot [Nome] conectado".

### 3.3. Detalhes do Bot > Regras & Ciclos (Novo)
*Objetivo: Definir comportamento temporal do robô.*

*   **Layout:** Grid de Cards.
*   **Controles:**
    *   **Intervalo de Busca (Scraper):** Slider horizontal (Range: 5min a 60min). Exibe o valor atual em um tooltip ou label ao lado.
    *   **Horário Comercial:** Toggle Switch (On/Off). "Respeitar horário (08:00 - 22:00)".
    *   **Ciclo de Postagem (Anti-Flood):** Input numérico com botões +/-. "Delay entre posts (segundos)".

### 3.4. Detalhes do Bot > Roteamento de Canais (Novo)
*Objetivo: Vincular canais e definir filtros de categoria.*

*   **Layout:** Split View (Master-Detail).
*   **Painel Esquerdo (Lista de Canais):**
    *   Lista vertical simples com fundo branco.
    *   Item selecionado recebe highlight azul claro (`#E5F1FB`) e barra lateral azul.
*   **Painel Direito (Configuração do Canal):**
    *   Título: "Routing Rules: [Nome do Canal]"
    *   **Seção "Allowed Categories":**
        *   Cluster de Tags selecionáveis.
        *   Estado Ativo: Fundo Azul, Texto Branco.
        *   Estado Inativo: Borda Cinza, Texto Preto.
    *   **Seção "Blacklist":**
        *   Input de texto que aceita múltiplas palavras-chave (chips).

---

## 4. Assets & Referências
Os mockups de alta fidelidade para as novas telas estão disponíveis na pasta `docs/mockups/`:
1.  `v1_style_integrations.png`
2.  `v1_style_routing.png`
