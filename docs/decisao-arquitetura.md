# Decisao De Arquitetura

## Stack Escolhida

- Next.js
- TypeScript
- Supabase
- Postgres
- Tailwind CSS
- shadcn/ui
- Vercel

## Justificativa

Next.js permite construir frontend e backend no mesmo projeto, reduzindo a quantidade de partes para manter. TypeScript melhora confiabilidade e manutencao. Supabase oferece Postgres, autenticacao e politicas de acesso, o que combina bem com um sistema que precisa proteger dados sensiveis. Tailwind e shadcn/ui permitem criar uma interface moderna sem depender de Bootstrap. Vercel simplifica deploy e entrega publica.

## Por Que Nao Continuar Em PHP

PHP poderia funcionar, principalmente com Laravel, mas a base antiga esta muito acoplada, repetida e insegura. Como o objetivo agora e entregar uma aplicacao moderna e publicavel, reconstruir em uma stack atual reduz retrabalho e facilita evolucao.

## Papel Do Projeto Antigo

O projeto antigo continua importante como fonte de:

- contexto do dominio;
- requisitos;
- nomes de entidades;
- fluxo esperado;
- exemplos de telas;
- estrutura inicial do banco.

Ele nao deve ser usado como base direta de codigo.

