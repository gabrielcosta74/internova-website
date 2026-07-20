# Notificações por email — `notify-lead`

Sempre que alguém submete o formulário do site, o pedido é gravado na tabela
`leads` e é enviado um email para **geral@internova.pt** com os dados.

O envio é feito por uma Edge Function do Supabase (`notify-lead`) que usa o
[Resend](https://resend.com) para entregar o email.

---

## Setup (uma vez)

### 1. Criar conta e verificar o domínio no Resend

1. Cria conta em https://resend.com (grátis até 3000 emails/mês).
2. Em **Domains → Add Domain**, adiciona `internova.pt`.
3. Adiciona no DNS do domínio os registos (SPF, DKIM) que o Resend mostra.
   Sem isto não é possível enviar emails *de* `geral@internova.pt`.
4. Em **API Keys**, cria uma key e copia o valor (`re_...`).

> Para testar antes de verificar o domínio, podes usar temporariamente o
> remetente `onboarding@resend.dev` (ver passo 3).

### 2. Ligar a CLI ao projeto

```bash
supabase login
supabase link --project-ref vaywtenhahxwkqbjqhcx
```

### 3. Configurar os secrets

```bash
supabase secrets set RESEND_API_KEY=re_a_tua_key_aqui
supabase secrets set NOTIFY_TO=geral@internova.pt
supabase secrets set NOTIFY_FROM="Internova <geral@internova.pt>"
# Enquanto o domínio não estiver verificado, podes usar:
# supabase secrets set NOTIFY_FROM="Internova <onboarding@resend.dev>"
```

### 4. Deploy da função

```bash
supabase functions deploy notify-lead
```

---

## Testar

```bash
curl -i -X POST \
  https://vaywtenhahxwkqbjqhcx.supabase.co/functions/v1/notify-lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@exemplo.com","challenge":"Quero saber mais."}'
```

Deves receber `{"ok":true,"id":"..."}` e o email em geral@internova.pt.

Logs em tempo real:

```bash
supabase functions logs notify-lead
```

---

## Como funciona

- O site ([`components/Footer.tsx`](../../components/Footer.tsx)) grava o lead e
  depois chama `supabase.functions.invoke('notify-lead', { body: lead })`.
- Se o email falhar, o pedido **continua gravado** e o utilizador vê na mesma a
  mensagem de sucesso — o erro só fica no log.
- A função aceita tanto `{ name, email, challenge }` (chamada do site) como
  `{ record: { ... } }` (caso queiras ligar um Database Webhook em alternativa).
