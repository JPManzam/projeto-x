# Product Brief: Plataforma de Gestão de Bots de Afiliação (Affiliate Bot Manager)

## 1. A Grande Ideia (Elevator Pitch)
Queremos construir o "Jarvis" dos afiliados: uma plataforma centralizada que gerencia exércitos de bots de Telegram de forma autônoma. O diferencial não é apenas postar ofertas, mas fazê-lo de forma inteligente (priorizando lucro), segura (evitando banimentos com stealth avançado) e escalável (rodando em infraestrutura gratuita/barata ARM64), tudo controlado por um dashboard Cyberpunk que faz o gestor se sentir um hacker de elite.

## 2. O Problema
Gestores de afiliados perdem horas configurando arquivos `.env`, sofrem com bloqueios constantes por scraping agressivo e não têm visibilidade de qual bot está realmente gerando lucro ou travado. A operação atual é manual, frágil e cega.

## 3. A Solução (Core Value Proposition)
Uma plataforma **"Set & Forget"**:
*   **Centralização:** Um único painel para controlar N bots.
*   **Segurança (Stealth):** Scraping via Playwright Patched + Proxies para burlar defesas da Shopee/AliExpress.
*   **Eficiência:** Algoritmos que priorizam produtos com alta comissão e descartam automaticamente "lixo" (ou pedem aprovação humana para casos suspeitos).
*   **Custo Zero/Baixo:** Otimizado para rodar no Oracle Cloud Free Tier (ARM64).

## 4. Funcionalidades Chave (MVP)
1.  **Dashboard "Mission Control":** Status em tempo real de todos os workers.
2.  **Scraping Híbrido Stealth:** Motor Playwright customizado para evadir detecção.
3.  **Fila de Aprovação Inteligente:** O sistema "pede permissão" antes de postar algo muito arriscado (ex: desconto > 80%).
4.  **Gestão de Proxies:** Rotação de IPs para evitar "blacklisting".
5.  **Multi-Persona:** Cada bot fala com a "voz" do seu nicho via templates.

## 5. Critérios de Sucesso
*   **Técnico:** Rodar 24/7 na Oracle Cloud (ARM64) sem estourar memória.
*   **Negócio:** Zero contas de afiliado banidas no primeiro mês.
*   **UX:** Configurar um novo bot em < 2 minutos.

## 6. Riscos & Mitigações
*   **Risco:** Shopee atualizar o anti-bot.
    *   *Mitigação:* Arquitetura modular que permite trocar o motor de scraping (ex: de Playwright para API Oficial) sem reescrever o sistema todo.
*   **Risco:** Custo de Proxies.
    *   *Mitigação:* Suporte nativo a proxies 4G rotativos baratos e fallback para modo "Low Frequency" se o proxy falhar.

## 7. Próximos Passos (Recomendação)
1.  **Arquitetura:** Definir o stack de filas (Redis vs BullMQ) e banco de dados.
2.  **UX Design:** Prototipar o Dashboard (foco no tema Cyberpunk).
3.  **Dev:** Criar o "Hello World" do Playwright Stealth em container ARM64.
