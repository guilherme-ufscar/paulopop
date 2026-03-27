# Deploy Local com Docker — Paulo Pop

> Todo o ambiente roda em Docker: Next.js app + PostgreSQL + migrations/seed automáticos.
> Nenhuma conta externa é necessária (exceto a API Key do Gemini para IA).

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- [Git](https://git-scm.com/) para clonar o projeto

---

## Primeira vez — Setup completo

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd paulopop
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o `.env.local` e preencha pelo menos:

```env
# Obrigatório — gerar com: openssl rand -base64 32
NEXTAUTH_SECRET=coloque-uma-string-aleatoria-longa-aqui

# Obrigatório para IA — obter em https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIza...

# URL pública do site
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> O banco PostgreSQL e o upload de arquivos são gerenciados automaticamente pelo Docker.
> Não é necessário configurar `DATABASE_URL` — o docker-compose já faz isso.

### 3. Subir todos os serviços

```bash
docker compose up --build
```

Isso vai:
1. Construir a imagem do Next.js
2. Subir o PostgreSQL
3. Rodar as migrations automaticamente (`prisma migrate deploy`)
4. Criar o usuário admin inicial (`npm run db:seed`)
5. Iniciar o servidor em `http://localhost:3000`

**Aguarde até ver no terminal:**
```
paulopop_app  | ✓ Ready in Xs
```

### 4. Acessar

| URL | Descrição |
|---|---|
| `http://localhost:3000` | Site público |
| `http://localhost:3000/admin` | Painel administrativo |

**Credenciais do admin:**
- E-mail: `admin@paulopop.com.br`
- Senha: `PauloPop@2025`

> **⚠️ Altere a senha imediatamente** em `/admin/configuracoes`

---

## Comandos do dia a dia

```bash
# Subir em background (sem travar o terminal)
docker compose up -d

# Ver logs em tempo real
docker compose logs -f app

# Parar todos os containers
docker compose down

# Parar e remover volumes (apaga banco e uploads — cuidado!)
docker compose down -v

# Reconstruir após mudanças no código
docker compose up --build

# Ver status dos containers
docker compose ps
```

---

## Atualizar o código (após git pull)

```bash
git pull origin master
docker compose up --build
```

Se houver mudanças no schema do banco, as migrations rodam automaticamente no container `migrate`.

---

## Backup do banco de dados

```bash
# Fazer backup
docker exec paulopop_postgres pg_dump -U paulopop paulopop > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker exec -i paulopop_postgres psql -U paulopop paulopop < backup_20240101.sql
```

---

## Backup dos uploads (imagens e documentos)

Os arquivos ficam no volume Docker `paulopop_uploads_data`. Para copiar para o host:

```bash
# Copiar uploads para pasta local
docker cp paulopop_app:/app/public/uploads ./uploads_backup
```

---

## Rodar em produção (servidor Linux)

No servidor Linux com Docker instalado:

```bash
# 1. Clonar e configurar
git clone <url-do-repo>
cd paulopop
cp .env.example .env.local
nano .env.local  # preencher as variáveis

# 2. Subir em produção (daemon)
docker compose up -d --build

# 3. Verificar
docker compose ps
docker compose logs app
```

### Expor na internet com Nginx (opcional)

Instale o Nginx no servidor e configure como proxy reverso:

```nginx
server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar HTTPS com Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com.br
```

---

## Checklist pós-deploy

- [ ] Acessar `http://localhost:3000` e ver a home
- [ ] Fazer login em `/admin` com as credenciais
- [ ] **Trocar a senha padrão** em Configurações
- [ ] Configurar foto, nome, CRECI e redes sociais nas Configurações
- [ ] Testar cadastro e publicação de um imóvel
- [ ] Testar formulário de lead no frontend
- [ ] Testar geração de texto por IA (aba Descrição do imóvel)
- [ ] Testar análise de mercado
- [ ] Testar envio de e-mail (se SMTP configurado)

---

## Solução de problemas

**App não inicia:**
```bash
docker compose logs app
```

**Banco não conecta:**
```bash
docker compose logs postgres
docker compose logs migrate
```

**Reconstruir do zero (apaga tudo):**
```bash
docker compose down -v
docker compose up --build
```

**Ver tabelas do banco:**
```bash
docker exec -it paulopop_postgres psql -U paulopop -d paulopop -c "\dt"
```
