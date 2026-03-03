# Agente Curador de Tecnologia (Telegram)

Este projeto é um agente inteligente desenvolvido com o **Google Agent Development Kit (ADK)** que identifica as principais tendências semanais em Arquitetura de Soluções, IA e QA, enviando um relatório formatado via Telegram.

O projeto foi projetado para rodar como um **Cloud Run Job** na GCP, sendo disparado automaticamente pelo **Cloud Scheduler**.

## 🚀 Funcionalidades

- **Curadoria Inteligente**: Utiliza o modelo Gemini para identificar tópicos quentes, resumos e links (Google/YouTube).
- **Integração com Telegram**: Envia mensagens automaticamente para um chat privado e/ou grupo.
- **Job Nativo (GCP)**: Executa a tarefa e finaliza, economizando custos e recursos.
- **Agendamento Serverless**: Acionado via Cloud Scheduler toda **sexta-feira às 18:00** (Horário de Brasília).

## 🛠️ Tecnologias Utilizadas

- [Google ADK](https://google.github.io/adk-docs/) - Framework para agentes de IA.
- [Telegraf](https://telegraf.js.org/) - Biblioteca para bots de Telegram.
- [Google Cloud Run Jobs](https://cloud.google.com/run/docs/create-jobs) - Infraestrutura de execução.
- [Google Cloud Scheduler](https://cloud.google.com/scheduler) - Agendador serverless.
- [TypeScript](https://www.typescriptlang.org/) - Linguagem principal.

## 📋 Pré-requisitos

1.  **Google Cloud Project**: Projeto ativo na GCP.
2.  **Google AI API Key**: Obtenha em [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  **Telegram Bot Token**: Crie um bot com o [@BotFather](https://t.me/botfather).
4.  **Service Account**: Conta de serviço com permissões para rodar o Job e acessar o Vertex AI.

## ⚙️ Configuração Local

1.  Clone o repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` baseado no `.env.example`:
    ```env
    GEMINI_API_KEY=AIza...
    TELEGRAM_BOT_TOKEN=852...
    TELEGRAM_CHAT_ID=123...
    TELEGRAM_GROUP_ID=
    GOOGLE_GENAI_USE_VERTEXAI=True
    ```

## 🚢 Como Realizar o Deploy (GCP)

Para realizar o deploy e configurar o agendamento na Google Cloud Platform, utilize os comandos nativos do SDK `gcloud`.

### 1. Build e Deploy do Job

Este comando compila o código localmente (usando o `Dockerfile`), envia os arquivos para o Cloud Build e cria/atualiza o Job no Cloud Run:

```bash
# Compile o projeto
npm run build

# Deploy do Job
gcloud run jobs deploy agent-telegram \
    --source . \
    --project=seu-projeto-id \
    --region=us-central1 \
    --service-account=sua-sa@seu-projeto-id.iam.gserviceaccount.com \
    --set-env-vars="GEMINI_API_KEY=sua_chave,TELEGRAM_BOT_TOKEN=seu_token,TELEGRAM_CHAT_ID=seu_id,GOOGLE_GENAI_USE_VERTEXAI=True,GOOGLE_CLOUD_PROJECT=seu-projeto-id,GOOGLE_CLOUD_LOCATION=us-central1"
```

### 2. Execução Manual (Teste)

Para testar se o Job está funcionando corretamente na nuvem:

```bash
gcloud run jobs execute agent-telegram --project=seu-projeto-id --region=us-central1
```

### 3. Configurar Agendamento Automático

Para que o Job rode toda sexta-feira às 18:00, crie um job no Cloud Scheduler:

```bash
gcloud scheduler jobs create http agent-telegram-trigger \
    --schedule="0 18 * * 5" \
    --uri="https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/seu-projeto-id/jobs/agent-telegram:run" \
    --http-method=POST \
    --location=us-central1 \
    --oauth-service-account-email=sua-sa@seu-projeto-id.iam.gserviceaccount.com \
    --project=seu-projeto-id \
    --time-zone="America/Sao_Paulo" \
    --description="Triggers the tech curator Cloud Run Job every Friday at 18:00"
```

## 📁 Estrutura do Projeto

- `agent.ts`: Lógica do agente pesquisador e inlined instructions.
- `notifier.ts`: Serviço de envio de mensagens para o Telegram.
- `index.ts`: Ponto de entrada (Job Script).
- `Dockerfile`: Configuração do container para o Cloud Run.
