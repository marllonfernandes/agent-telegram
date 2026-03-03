# Agente Curador de Tecnologia (Telegram)

Este projeto é um agente inteligente desenvolvido com o **Google Agent Development Kit (ADK)** que identifica as principais tendências semanais em Arquitetura de Soluções, IA e QA, enviando um relatório formatado via Telegram.

## 🚀 Funcionalidades

- **Curadoria Inteligente**: Utiliza o modelo Gemini para identificar tópicos quentes, resumos e links (Google/YouTube).
- **Integração com Telegram**: Envia mensagens automaticamente para um chat privado e/ou grupo.
- **Agendamento Automático**: Configurado para rodar toda **sexta-feira às 18:00** (Horário de Brasília).
- **Execução Flexível**: Suporta execução manual imediata para testes.

## 🛠️ Tecnologias Utilizadas

- [Google ADK](https://google.github.io/adk-docs/) - Framework para agentes de IA.
- [Telegraf](https://telegraf.js.org/) - Biblioteca para bots de Telegram.
- [Node-cron](https://www.npmjs.com/package/node-cron) - Agendador de tarefas.
- [TypeScript](https://www.typescriptlang.org/) - Linguagem principal.

## 📋 Pré-requisitos

1.  **Google AI API Key**: Obtenha em [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Telegram Bot Token**: Crie um bot com o [@BotFather](https://t.me/botfather).
3.  **Chat IDs**: Você precisará do seu ID de usuário e do ID do grupo. Para encontrá-los, acesse o link abaixo substituindo `<SEU_BOT_TOKEN>` pelo token do seu bot:
    `https://api.telegram.org/bot<SEU_BOT_TOKEN>/getUpdates`
    (Certifique-se de ter enviado uma mensagem para o bot antes de acessar o link).

## ⚙️ Configuração

1.  Clone o repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` baseado no `.env.example`:
    ```env
    GEMINI_API_KEY=sua_chave_aqui
    TELEGRAM_BOT_TOKEN=seu_token_aqui
    TELEGRAM_CHAT_ID=seu_id_pessoal
    TELEGRAM_GROUP_ID=id_do_grupo
    ```

## 🏃 Como Rodar

### Modo Desenvolvimento (Execução Imediata)

Para testar o agente agora mesmo sem esperar pela sexta-feira:

```bash
npm run dev -- --now
```

### Modo Produção

1.  Compile o código:
    ```bash
    npm run build
    ```
2.  Inicie o agendador:
    ```bash
    npm start
    ```

## 📁 Estrutura do Projeto

- `agent.ts`: Lógica do agente pesquisador e suas instruções.
- `notifier.ts`: Serviço de envio de mensagens para o Telegram.
- `scheduler.ts`: Configuração do cron job semanal.
- `index.ts`: Ponto de entrada da aplicação.
- `Ultimos assuntos Tecnologia.md`: Prompt base com as regras de curadoria.
