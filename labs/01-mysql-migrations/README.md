# Lab 01 — Database & Data Migrations (Expand & Contract)

Estudo prático sobre evolução segura de schema e migração de dados em produção utilizando **NestJS, TypeScript, TypeORM, MySQL 8, Vitest e Docker**.

## Problema Técnico

Dividir uma coluna existente em produção (`users.full_name` → `first_name` + `last_name`) sem perda de dados e sem downtime exige cuidados que `synchronize: true` não resolve:

1. **Risco de perda de dados:** `synchronize: true` dropa e recria colunas em alterações estruturais.
2. **Implicit Commit no MySQL:** Instruções DDL (`CREATE`, `ALTER`, `DROP`) no MySQL executam _commit_ implícito e não sofrem rollback automático caso uma query DML (`UPDATE`) falhe na mesma transação.
3. **Execução em Produção:** Migrations no container de produção rodam sobre o código JavaScript compilado (`dist/database/data-source.js`) via `entrypoint.sh` antes do boot do NestJS, eliminando dependência de `ts-node` em runtime.

## Solução: Padrão Expand & Contract

A mudança foi quebrada em 3 migrations atômicas (`migrationsTransactionMode: 'each'`) e reversíveis:

| Ordem | Arquivo                                | Tipo          | Responsabilidade                                           |
| :---- | :------------------------------------- | :------------ | :--------------------------------------------------------- |
| 1     | `1700000000000-CreateUsersTable`       | Schema + Seed | Cria `users` e popula registros legados iniciais           |
| 2     | `1700000001000-ExpandUserNames`        | Schema (DDL)  | Adiciona `first_name` e `last_name` como `NULLABLE`        |
| 3     | `1700000002000-MigrateUserNamesData`   | Data (DML)    | Divide e higieniza `full_name` dentro de transação isolada |
| 4     | `1700000003000-ContractFullNameColumn` | Schema (DDL)  | Aplica `NOT NULL` e remove `full_name`                     |

## Como Executar e Validar

```bash
# 1. Subir MySQL + API (aplica migrations automaticamente no boot)
docker compose up -d --build

# 2. Conferir logs da execução automática das migrations
docker logs lab01_nestjs_api

# 3. Rodar suíte E2E de integridade e reversibilidade (requer DB_HOST=localhost e DB_PORT=3307 no .env)
npm run test:migrations
```
