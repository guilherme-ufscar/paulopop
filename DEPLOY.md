# Checklist de Deploy em Produção — Paulo Pop

## 1. Banco de Dados (Supabase ou PlanetScale)

```bash
# 1. Criar projeto no Supabase (https://supabase.com)
# 2. Copiar a DATABASE_URL do painel de conexão
# 3. Rodar migrations em produção
npx prisma migrate deploy

# 4. Criar usuário admin inicial
npm run db:seed
```

**Verificar:** Acesse o Supabase Table Editor e confirme que a tabela `users` tem o admin criado.

---

## 2. Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Linkar repositório
vercel link

# 4. Deploy inicial
vercel --prod
```

### Variáveis de Ambiente na Vercel

Configure todas as variáveis do `.env.example` no painel da Vercel:
- `Settings > Environment Variables`

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ | URL PostgreSQL (Supabase) |
| `NEXTAUTH_SECRET` | ✅ | String aleatória segura (min 32 chars) |
| `NEXTAUTH_URL` | ✅ | URL de produção (ex: https://paulopop.com.br) |
| `ANTHROPIC_API_KEY` | ✅ | Para geração de textos por IA |
| `GEMINI_API_KEY` | ✅ | Para análise de mercado |
| `SMTP_HOST` | ✅ | Para e-mails de leads |
| `SMTP_PORT` | ✅ | Porta SMTP (ex: 587) |
| `SMTP_USER` | ✅ | Usuário SMTP |
| `SMTP_PASSWORD` | ✅ | Senha SMTP |
| `EMAIL_FROM` | ✅ | E-mail remetente |
| `NOTIFICATION_EMAIL` | ✅ | E-mail do corretor para receber leads |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL pública do site |
| `NEXT_PUBLIC_SITE_NAME` | ✅ | Nome do site |
| `NEXT_PUBLIC_WHATSAPP` | ✅ | Número WhatsApp com DDI |
| `UPLOAD_DIR` | ✅ | `/public/uploads` |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | ❌ | Opcional |
| `OPENCAGE_API_KEY` | ❌ | Para geocodificação |

### Domínio Customizado

1. `Vercel > Settings > Domains > Add Domain`
2. Configurar DNS no seu provedor (A record para IPs da Vercel ou CNAME)
3. Aguardar propagação (até 48h)
4. HTTPS é configurado automaticamente pela Vercel

---

## 3. Cloudinary (para imagens em produção)

> O sistema usa upload local por padrão. Para produção em Vercel, as imagens precisam de armazenamento externo.

```bash
# 1. Criar conta em https://cloudinary.com
# 2. Ir em Settings > Upload > Upload Presets > Add preset
# 3. Configurar preset como "Unsigned" (ou "Signed" para maior segurança)
```

Adicionar variáveis:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## 4. Pós-Deploy — Verificação Manual

### Acesso Admin
- [ ] Acessar `https://seudominio.com.br/admin`
- [ ] Fazer login com `admin@paulopop.com.br` / `PauloPop@2025`
- [ ] **ALTERAR A SENHA IMEDIATAMENTE** em Configurações

### Funcionalidades
- [ ] Cadastrar um imóvel de teste e publicar
- [ ] Verificar que aparece no frontend (`/imoveis`)
- [ ] Testar formulário de lead no frontend
- [ ] Confirmar e-mail de notificação foi recebido
- [ ] Testar geração de descrição por IA (aba Descrição)
- [ ] Testar análise de mercado
- [ ] Verificar galeria de imagens funcionando
- [ ] Testar autopreenchimento de CEP

### SEO
- [ ] Verificar `https://seudominio.com.br/sitemap.xml`
- [ ] Verificar `https://seudominio.com.br/robots.txt`
- [ ] Testar OG tags com [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Testar Twitter Card com [Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Submeter sitemap no [Google Search Console](https://search.google.com/search-console)

### Performance
- [ ] Rodar [PageSpeed Insights](https://pagespeed.web.dev/) na home
- [ ] Verificar score > 85 no mobile

### Segurança
- [ ] Verificar headers de segurança em [Security Headers](https://securityheaders.com/)
- [ ] Confirmar HTTPS ativo e certificado válido
- [ ] Confirmar que `/api/admin/**` retorna 401 sem autenticação

---

## 5. Atualizações Futuras

```bash
# 1. Fazer push das mudanças para o GitHub
git push origin master

# 2. A Vercel faz deploy automático (se GitHub integrado)
# OU manualmente:
vercel --prod

# 3. Se houver mudanças no schema do banco:
npx prisma migrate deploy
```

---

## 6. Monitoramento

- **Logs**: `Vercel > Project > Functions` (logs em tempo real)
- **Erros**: Considerar integrar [Sentry](https://sentry.io) para rastreamento de erros
- **Analytics**: Google Analytics ou Vercel Analytics (`vercel analytics enable`)
