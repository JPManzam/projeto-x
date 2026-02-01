# UX/UI Design Specification: Plataforma de Gestão de Bots

**Status:** Aprovado para Implementação  
**Autor:** Sally (UX Designer Agent)  
**Baseado em:** `prd.md`, `product-brief.md`, Feedback do Usuário (Estilo Windows 11 Fluent Design / Mica)

---

## 1. Princípios de Design & Estética (UI)

**Diretriz Principal:** "Familiaridade e Memória Muscular". A aplicação deve parecer uma extensão nativa do Windows 11. Deve ser intuitiva para qualquer usuário de Windows, eliminando a curva de aprendizado. O objetivo é que o usuário sinta que está usando uma ferramenta nativa do sistema (como o "Configurações" ou "Gerenciador de Arquivos").

*   **Design System:** **Microsoft Fluent Design 2 (Windows 11 Style)**.
*   **Material Base:** **Mica** e **Acrylic**.
    *   *Fundo:* Uso do efeito **Mica**, que incorpora sutilmente a cor do papel de parede do usuário, criando uma sensação de leveza e hierarquia visual sem distrações.
    *   *Superfícies:* Camadas sutis de cinza/branco (Light Mode) ou cinza escuro (Dark Mode) para separar conteúdo, utilizando elevação e bordas muito sutis (1px) ao invés de cores fortes.
*   **Paleta de Cores (Sóbria e Nativa):**
    *   **Primary:** Windows Blue `#0067C0` (Light) / `#4CC2FF` (Dark) - Usado com parcimônia apenas para ações principais.
    *   **Background:** Efeito Mica (transparente/adaptativo) ou `#F3F3F3` (fallback light) / `#202020` (fallback dark).
    *   **Texto:** Preto `#000000` (High Contrast) e Cinza Escuro `#5D5D5D` (Secondary) no Light Mode. Branco e Cinza Claro no Dark Mode.
    *   **Status Colors (Suaves):**
        *   Ativo: Verde Status Padrão (Ponto verde pequeno).
        *   Atenção: Laranja Status Padrão.
        *   Erro: Vermelho Status Padrão.
*   **Tipografia:**
    *   **'Segoe UI Variable'**: A fonte padrão do Windows. Essencial para a sensação de familiaridade.
    *   Pesos de fonte usados para hierarquia (SemiBold para títulos, Regular para corpo).
*   **Formas e Geometria:**
    *   **Rounded Corners:** Bordas arredondadas de `8px` para cards overlay e `4px` para inputs/botões.
    *   **Ícones:** Segoe Fluent Icons (Ícones lineares finos padrão do Windows 11).

---

## 2. Sitemap & Arquitetura de Informação

A estrutura segue o padrão **"Navigation Pane"** (Barra lateral esquerda) comum a apps modernos do Windows.

```mermaid
graph LR
    A[Navigation Pane (Lateral)] --> B[Home (Visão Geral)]
    A --> C[Bots (Lista)]
    A --> D[Aprovações]
    A --> E[Configurações]
    
    C --> C1[Edição de Bot (Painel Lateral/Sheet)]
```

---

## 3. Wireframes & Detalhamento de Telas

### 3.1. Home (Visão Geral)
**Referência Visual:** Tela inicial do app "Configurações" do Windows 11.

*   **Header:** Título simples "Visão Geral" à esquerda. Limpo, sem avatares chamativos ou badges neon.
*   **Seção Hero (Topo):**
    *   Card único ou agrupado com saudação simples e resumo de status.
    *   Ex: "Bom dia. 5 bots estão rodando ativamente."
*   **Widgets de Resumo (Cards Estilo Dashboard Windows):**
    *   *Aprovações Pendentes:* Card simples com número e botão de ação "Revisar".
    *   *Performance:* Gráfico de linha minimalista (cor única) mostrando cliques nas últimas 24h.

### 3.2. Bots (Gerenciamento)
**Referência Visual:** Explorador de Arquivos (Modo Detalhes ou Lista).

*   **Layout de Lista (Data Grid):**
    *   Colunas: Nome do Bot, Nicho, Status, Última Varredura, Ações.
    *   **Status:** Uso de badges discretos ou apenas um ponto colorido (Dot) antes do texto (ex: `• Rodando`).
*   **Barra de Comandos (Command Bar):**
    *   Localizada no topo (abaixo do título).
    *   Botões: `[+] Novo Bot`, `[||] Pausar`, `[x] Excluir`, `[Refresh] Atualizar`.
*   **Adicionar Novo Bot (Modal Nativo):**
    *   Dialog simples, centralizado, fundo branco/cinza.
    *   Inputs padrão do Windows (Caixa de texto com underline ou borda inferior em foco).
    *   Nada de "Wizards" complexos. Formulário direto.

### 3.3. Aprovações (Approval Center)
**Referência Visual:** App "Fotos" (Visualização de Galeria) ou Cliente de Email.

*   **Grid de Itens:** Imagens dos produtos com informações essenciais abaixo.
*   **Seleção:**
    *   Checkbox no canto superior de cada item (aparece ao passar o mouse, estilo Windows Explorer).
    *   Barra flutuante ou fixa no topo aparece quando itens são selecionados: `Aprovar (3)`, `Rejeitar`.
*   **Visual do Card de Produto:**
    *   Limpo, borda sutil, sombra suave apenas no hover.
    *   Preço e Desconto em destaque tipográfico (Negrito), não em badges coloridos gritantes.

### 3.4. Configurações
**Referência Visual:** Exatamente igual à tela de Configurações do Windows.

*   Menu lateral de subcategorias se necessário.
*   Controles: Toggles (On/Off) estilo pílula padrão do Windows.
*   Inputs de API Key: Campo de senha padrão com botão "olho" para revelar.

---

## 4. Fluxos de Operação

Fluxos desenhados para serem rápidos e sem fricção ("clique e pronto").

### Fluxo: Revisão Diária
1.  Usuário abre o app. Interface leve e familiar carrega instantaneamente.
2.  Na Home, vê card "Aprovações Pendentes: 3". Clica no card.
3.  Navega para a tela "Aprovações".
4.  Seleciona os 3 produtos (clica nas caixas de seleção ou arrasta o mouse para selecionar múltiplo).
5.  Clica no botão "Aprovar" na barra de ferramentas superior.
6.  Tarefa concluída. Fecha o app ou minimiza para a bandeja (System Tray).

---

## 5. Diretrizes para o Desenvolvedor (Hand-off)

*   **Framework:** React ou Electron (se for desktop nativo).
*   **UI Library (Essencial):**
    *   **Fluent UI React v9 (Microsoft):** A biblioteca oficial para garantir 100% de fidelidade visual.
    *   *Alternativa:* Radix UI com estilização cuidadosa para replicar o Fluent Design.
*   **Ícones:** `Fluent System Icons` (Package oficial).
*   **Comportamento:**
    *   Hover effects sutis (leve clareamento do fundo).
    *   Foco em acessibilidade e navegação por teclado (Tab navigation).
    *   Scrollbars nativas finas (Overlay scrollbars).

