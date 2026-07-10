// =============================================================
// Edge Function: notify-lead
// Envia um email para geral@internova.pt sempre que chega um
// novo pedido pelo formulário do site.
//
// Deploy:  supabase functions deploy notify-lead
// Secrets: supabase secrets set RESEND_API_KEY=...
//          supabase secrets set NOTIFY_TO=geral@internova.pt
//          supabase secrets set NOTIFY_FROM="Internova <geral@internova.pt>"
// =============================================================

interface LeadPayload {
  name: string;
  email: string;
  challenge: string;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "geral@internova.pt";
// O remetente TEM de ser de um domínio verificado no Resend.
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "Internova <geral@internova.pt>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY não está configurada.");
    return json({ error: "Email service not configured" }, 500);
  }

  let lead: LeadPayload;
  try {
    const body = await req.json();
    // Suporta tanto invocação direta { name, email, challenge }
    // como Database Webhook do Supabase { record: { ... } }.
    lead = body.record ?? body;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const name = (lead.name ?? "").toString().trim();
  const email = (lead.email ?? "").toString().trim();
  const challenge = (lead.challenge ?? "").toString().trim();

  if (!name || !email || !challenge) {
    return json({ error: "Missing fields (name, email, challenge)" }, 400);
  }

  const submittedAt = new Date().toLocaleString("pt-PT", {
    timeZone: "Europe/Lisbon",
    dateStyle: "full",
    timeStyle: "short",
  });

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#0d0d0d;color:#e5e5e5;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f">
    <div style="padding:24px 28px;border-bottom:1px solid #1f1f1f">
      <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:-0.5px;color:#fff">
        Inter<span style="color:#818cf8">nova</span>
      </p>
      <p style="margin:4px 0 0;font-size:13px;color:#888">Novo pedido recebido pelo site</p>
    </div>
    <div style="padding:28px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr>
          <td style="padding:8px 0;color:#888;width:90px;vertical-align:top">Nome</td>
          <td style="padding:8px 0;color:#fff;font-weight:600">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;vertical-align:top">Email</td>
          <td style="padding:8px 0">
            <a href="mailto:${escapeHtml(email)}" style="color:#818cf8;text-decoration:none">${escapeHtml(email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;vertical-align:top">Recebido</td>
          <td style="padding:8px 0;color:#bbb">${escapeHtml(submittedAt)}</td>
        </tr>
      </table>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #1f1f1f">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888">Desafio / Mensagem</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#ddd;white-space:pre-wrap">${escapeHtml(challenge)}</p>
      </div>
      <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent("Internova - Resposta ao seu pedido")}"
         style="display:inline-block;margin-top:24px;padding:12px 22px;background:#4f46e5;color:#fff;font-weight:600;font-size:14px;text-decoration:none;border-radius:10px">
        Responder a ${escapeHtml(name)}
      </a>
    </div>
  </div>`;

  const text =
    `Novo pedido recebido pelo site Internova\n\n` +
    `Nome: ${name}\n` +
    `Email: ${email}\n` +
    `Recebido: ${submittedAt}\n\n` +
    `Desafio / Mensagem:\n${challenge}\n`;

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      reply_to: email,
      subject: `Novo pedido — ${name}`,
      html,
      text,
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    console.error("Resend error:", resp.status, detail);
    return json({ error: "Failed to send email", detail }, 502);
  }

  const data = await resp.json();
  return json({ ok: true, id: data.id });
});
