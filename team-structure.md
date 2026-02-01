# Equipe e Fluxo de Trabalho (Squad)

## 1. O Time (The Squad)

### **Luan (Tech Lead & Dev)**
- **Role:** O Construtor. Guardião do Código e da Infra.
- **Foco:** Viabilidade técnica, implementação robusta, infraestrutura Oracle/Docker, e Clean Code.
- **Poder de Veto:** Pode barrar features que ameacem a performance ou a segurança.

### **Junior (Designer & UX)**
- **Role:** O Arquiteto Visual. Guardião da Consistência.
- **Foco:** UI/UX no Figma, Design System, e experiência "No-Code" intuitiva.
- **Entrega:** Protótipos High-Fidelity com estados de erro/loading/sucesso.

### **João (PM & QA)**
- **Role:** O Estrategista. Guardião do Valor e da Qualidade.
- **Foco:** Backlog, aprovação de releases (QA), e garantir que o produto resolve o problema de negócio (ROI).
- **Poder de Aceite:** A task só é "Done" quando o João aprova funcionalmente.

## 2. Matriz de Responsabilidades (RACI Adaptada)

| Processo | Luan (Dev) | Junior (Design) | João (PM/QA) |
| :--- | :--- | :--- | :--- |
| **Discovery** | Consultado | Consultado | **Accountable (Dono)** |
| **Prototipagem (Figma)** | Consultado | **Accountable (Dono)** | Aprovador |
| **Tech Spec (Arquitetura)** | **Accountable (Dono)** | Informado | Consultado |
| **Implementação (Código)** | **Executor** | Apoio (Assets) | Informado |
| **QA Visual** | Corretor | **Aprovador** | Informado |
| **QA Funcional/Negócio** | Corretor | Informado | **Aprovador Final** |
| **Deploy/Infra** | **Executor** | Informado | Informado |

## 3. Definition of Ready (DoR) - Critérios para Dev Começar
O Luan **NÃO** inicia uma task sem:
1.  **User Story Clara:** Título, Descrição, "Como usuário, quero... para...".
2.  **Critérios de Aceite:** Lista de verificação funcional (bdd).
3.  **Figma Completo:** Telas de Happy Path, Erro, Loading e Empty State.
4.  **Assets Prontos:** Ícones, SVGs e Tokens definidos.

## 4. Definition of Done (DoD) - Critérios para Release
Uma task só é considerada **FINALIZADA** quando:
1.  **Code Review:** Aprovado pelo Luan (padrões técnicos).
2.  **Review Visual:** Aprovado pelo Junior (fidelidade ao Figma).
3.  **Review Funcional:** Aprovada pelo João (bug free + atende ao negócio).
