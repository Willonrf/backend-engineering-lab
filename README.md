# Backend Engineering Lab

Repositório de laboratórios práticos e isolados focados em arquitetura backend, persistência de dados, protocolos de comunicação, segurança e infraestrutura.

Cada diretório em `/labs` representa um estudo de caso autocontido com ambiente Docker reproduzível, testes automatizados e documentação das decisões técnicas tomadas.

---

## Roadmap & Módulos Implementados

| #   | Módulo                                                   | Stack Principal                                    | Conceitos-Chave                                                                                    | Status    |
| :-- | :------------------------------------------------------- | :------------------------------------------------- | :------------------------------------------------------------------------------------------------- | :-------- |
| 01  | [Database & Data Migrations](./labs/01-mysql-migrations) | NestJS, TypeScript, TypeORM, MySQL, Vitest, Docker | Schema vs Data Migration, Expand & Contract, Implicit Commit (DDL), Rollback & E2E Integrity Tests | Concluído |

---

## Padrão de Organização dos Laboratórios

Todo laboratório dentro de `labs/` segue a mesma estrutura para facilitar a avaliação e execução:

- **Ambiente Isolado:** `docker-compose.yml` próprio com _healthchecks_ e automação de inicialização.
- **Prova Automatizada:** Suíte de testes (Jest/Vitest) validando o comportamento esperado e cenários de falha.
- **Documentação Objetiva:** `README.md` interno explicando o problema, os trade-offs da solução e os comandos para rodar em 1 minuto.

---

## Como Executar Qualquer Módulo

```bash
# 1. Clone o repositório
git clone [https://github.com/Willonrf/backend-engineering-lab.git](https://github.com/Willonrf/backend-engineering-lab.git)

# 2. Acesse o laboratório desejado
cd backend-engineering-lab/labs/01-mysql-migrations

# 3. Siga as instruções do README local (geralmente um único docker compose up)
```
