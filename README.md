# 🐋 OrcaPro - Plataforma de Gestão Financeira Pessoal

> Aplicação Full Stack desenvolvida para centralizar o controle de contas, transações, investimentos e metas financeiras em uma única plataforma, oferecendo uma visão completa da saúde financeira do usuário.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square\&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square\&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square\&logo=typescript)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?style=flat-square\&logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square\&logo=openjdk)](https://www.java.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square\&logo=postgresql)](https://neon.tech)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=flat-square)]()
[![License](https://img.shields.io/badge/Licença-MIT-green.svg?style=flat-square)](LICENSE)

[🚀 Início Rápido](#-início-rápido) • [📖 Documentação](#-documentação) • [🏗️ Arquitetura](#️-arquitetura)

</div>

---

## 📋 Índice

* [Visão Geral](#-visão-geral)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias](#-tecnologias)
* [Arquitetura](#️-arquitetura)
* [Estrutura do Projeto](#-estrutura-do-projeto)
* [Início Rápido](#-início-rápido)
* [Deploy](#-deploy)
* [Segurança](#-segurança)
* [Aprendizados](#-aprendizados)
* [Documentação](#-documentação)
* [Contribuição](#-contribuição)

---

## 🎯 Visão Geral

O **OrcaPro** é uma aplicação de gestão financeira pessoal que permite ao usuário controlar suas finanças de forma organizada através de uma interface moderna e intuitiva.

### Principais recursos

* 💳 Gerenciamento de múltiplas contas
* 📊 Controle de receitas e despesas
* 🎯 Acompanhamento de metas financeiras
* 📈 Gestão de investimentos
* 🏷️ Categorização de movimentações
* 📉 Dashboard com gráficos e indicadores
* 🔐 Autenticação baseada em JWT

### Diferenciais

* ✨ Interface moderna e responsiva
* 📊 Visualização gráfica dos dados financeiros
* 🔄 Arquitetura Full Stack moderna
* ⚙️ Integração entre Next.js, Spring Boot e PostgreSQL
* ☁️ Estrutura preparada para deploy em nuvem

---

## ✨ Funcionalidades

### 🏠 Dashboard

Visualização consolidada da situação financeira através de indicadores, gráficos e widgets.

### 💳 Gestão de Contas

Cadastro e gerenciamento de contas bancárias e carteira física.

### 💰 Controle de Transações

Registro de receitas e despesas com categorização personalizada.

### 🎯 Metas Financeiras

Criação e acompanhamento de objetivos financeiros.

### 📈 Investimentos

Controle de aportes, resgates e evolução dos investimentos.

### 🏷️ Categorias

Organização das movimentações financeiras por categorias.

---

## 🛠️ Tecnologias

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Recharts

### Backend

* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Maven

### Banco de Dados

* PostgreSQL
* Neon Database

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura em camadas, separando responsabilidades entre frontend, backend e banco de dados.

```text
┌─────────────────────────┐
│   Frontend (Next.js)    │
│  - React Components     │
│  - Tailwind CSS         │
│  - Recharts             │
└──────────────┬──────────┘
               │
               │ HTTP
               │
┌──────────────▼──────────┐
│ BFF (Next.js API Routes)│
│  - Proxy de requisições │
│  - Integração da API    │
└──────────────┬──────────┘
               │
               │ HTTP/REST
               │
┌──────────────▼──────────┐
│  Backend (Spring Boot)  │
│  - Controllers          │
│  - Services             │
│  - JWT Security         │
└──────────────┬──────────┘
               │
               │ JPA/Hibernate
               │
┌──────────────▼──────────┐
│ PostgreSQL (Neon)       │
└─────────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
orcapro/
├── frontend/                          # Aplicação Next.js
│   ├── app/                           # Páginas e rotas
│   ├── components/                    # Componentes React reutilizáveis
│   ├── hooks/                         # Custom hooks para requisições HTTP
│   ├── interfaces/                    # Tipos TypeScript
│   └── README.md                      # Documentação do frontend
│
├── backend/                           # API Spring Boot
│   ├── src/main/java/br/com/fiap/orcapro/
│   │   ├── controller/                # Controladores REST
│   │   ├── service/                   # Lógica de negócio
│   │   ├── repository/                # Acesso a dados (JPA)
│   │   ├── model/                     # Entidades do banco
│   │   ├── security/                  # Autenticação JWT
│   │   └── config/                    # Configurações Spring
│   └── README.md                      # Documentação do backend
│
└── docs/                              # Documentação geral
    └── ENHANCEMENT_GUIDE.md           # Guia de melhorias
```

---

## 🚀 Início Rápido

### Pré-requisitos

* Node.js 18+
* npm
* Java 21+
* Maven
* PostgreSQL

### 1️⃣ Clonar o projeto

```bash
git clone https://github.com/GabrielSantos15/OrcaPro.git
cd OrcaPro
```

### 2️⃣ Configurar o banco de dados

Crie um banco PostgreSQL local ou utilize um serviço em nuvem como o Neon.

### 3️⃣ Executar o Backend

```bash
cd backend
```

Configure as variáveis de ambiente:

```env
DB_URL=<url_do_banco_postgresql>
DB_USER=<usuario_do_banco>
DB_PASSWORD=<senha_do_banco>
JWT_SECRET=<chave_jwt_com_32_ou_mais_caracteres>
```

Execute a aplicação:

```bash
mvn clean install
mvn spring-boot:run
```

API disponível em:

```text
http://localhost:8080
```

### 4️⃣ Executar o Frontend

Abra outro terminal:

```bash
cd frontend
npm install
```

Crie o arquivo `.env.local`:

```env
NEXT_PUBLIC_BASE_URL_BACKEND=http://localhost:8080
```

Inicie o projeto:

```bash
npm run dev
```

Aplicação disponível em:

```text
http://localhost:3000
```

---

## 📖 Documentação

<!-- * [Frontend README](./frontend/README.md) -->
* [Backend README](./backend/README.md)

---

## 🚀 Deploy

O projeto foi estruturado para implantação em ambientes cloud utilizando:

* Frontend: Vercel
* Backend: Render
* Banco de Dados: Neon PostgreSQL

A publicação em produção será realizada em versões futuras do projeto.

---

## 🔐 Segurança

* Autenticação baseada em JWT
* Senhas criptografadas com BCrypt
* Controle de acesso a rotas protegidas
* Validação de dados de entrada
* Variáveis de ambiente para credenciais sensíveis

---

## 📚 Aprendizados

Durante o desenvolvimento do OrcaPro foram aplicados conceitos de:

* Arquitetura em camadas
* APIs REST
* Spring Boot e Spring Security
* Autenticação com JWT
* Spring Data JPA
* Modelagem relacional
* Integração Frontend/Backend
* React e Next.js
* PostgreSQL
* Migração Oracle → PostgreSQL
* Configuração de variáveis de ambiente
* Planejamento de deploy em nuvem

---

## 🤝 Contribuição

Sugestões, melhorias e feedbacks são bem-vindos.

Caso encontre algum problema ou tenha ideias para evolução do projeto, fique à vontade para abrir uma issue ou enviar um pull request.

---

## 📞 Contato

**Gabriel Santos**

* GitHub: https://github.com/GabrielSantos15
* LinkedIn: https://www.linkedin.com/in/gabrielsantos1509/
* Email: [gabriel.santos.tech256@gmail.com](mailto:gabriel.santos.tech256@gmail.com)

---

<div align="center">

Desenvolvido como projeto acadêmico e de portfólio para demonstrar conhecimentos em desenvolvimento Full Stack utilizando Next.js, Spring Boot e PostgreSQL.

⭐ Se este projeto foi útil ou interessante para você, considere deixar uma estrela no repositório.

</div>
