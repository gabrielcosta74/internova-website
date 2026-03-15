# SQL Migrations — Admin Panel

## Ordem de execução

### 01_admin_panel_tables.sql
Cria:
- Tabela `site_content` — guarda overrides de conteúdo editados no admin
- Adiciona colunas `status` e `notes` à tabela `leads` existente

**Correr no Supabase → SQL Editor → New Query → colar o ficheiro → Run**

---

## Como funciona

1. Corres o SQL no Supabase
2. O painel admin fica disponível em `/admin`
3. Qualquer texto editado no admin é guardado em `site_content`
4. O site público lê primeiro o Supabase, e se não houver override usa os ficheiros JSON
