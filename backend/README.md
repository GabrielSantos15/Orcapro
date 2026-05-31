# 🐋 OrcaPro - Backend API

> API REST Spring Boot 4.0.6 para gestão financeira pessoal com autenticação JWT e PostgreSQL

<div align="center">

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-25-ED8B00?style=flat-square&logo=java)](https://www.java.com)
[![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?style=flat-square&logo=apache-maven)](https://maven.apache.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/Licença-MIT-green.svg?style=flat-square)](../LICENSE)

[🔙 Voltar ao Repositório Principal](../README.md)

</div>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Início Rápido](#-início-rápido)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Endpoints da API](#-endpoints-da-api)
- [Autenticação](#-autenticação)
- [Build & Deploy](#-build--deploy)

---

## 🎯 Visão Geral

**OrcaPro Backend** é uma API REST robusta construída com **Spring Boot 4.0.6** fornecendo funcionalidades completas de gestão financeira.

### Características

✅ Endpoints REST estruturados  
✅ Autenticação JWT  
✅ Spring Data JPA com PostgreSQL  
✅ Validação de entrada  
✅ CORS configurado  
✅ Tratamento de erros estruturado  

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Propósito |
|-----------|---------|---------|
| **Spring Boot** | 4.0.6 | Framework principal |
| **Java** | 25 | Linguagem de programação |
| **Spring Data JPA** | 4.0.6 | ORM e acesso a dados |
| **Spring Security + JWT** | 4.0.6 | Autenticação e autorização |
| **PostgreSQL** | 14+ | Banco de dados relacional |
| **Maven** | 3.9+ | Gerenciador de dependências |

---

## 🚀 Início Rápido

### Pré-requisitos

- **Java** 25+
- **Maven** 3.9+
- **PostgreSQL** 14+ (ou [Neon PostgreSQL](https://neon.tech))

### 1️⃣ Configure o Banco de Dados

Configure o arquivo `application.properties` em `src/main/resources/` com seus dados de conexão:

### 2️⃣ Compile e execute

```bash
mvn clean install
mvn spring-boot:run
```

✅ API disponível em **http://localhost:8080**

---

## 📁 Estrutura do Projeto

```
backend/
├── src/main/java/br/com/fiap/orcapro/
│   ├── config/                  # Configurações
│   │
│   ├── controller/              # Controladores REST
│   │
│   ├── dto/                     # Data Transfer Objects
│   │
│   ├── enums/                  # Enums do projeto
│   │
│   ├── model/                   # Entidades JPA
│   │
│   ├── repository/              # Acesso a Dados (JPA)
│   │
│   ├── service/                 # Lógica de Negócio
│   │
│   └── OrcaProApplication.java
│
└── pom.xml                      # Configuração Maven
```

---

## 🔧 Configuração

### Variáveis de Ambiente Principais

```properties
# Banco de Dados
spring.datasource.url
spring.datasource.username
spring.datasource.password

# JWT
jwt.secret
jwt.expiration

# Server
server.port
server.servlet.context-path
```

---

## 🔗 Endpoints da API

### Autenticação

```
POST   /api/usuario                   - Registrar novo usuário
POST   /api/usuario/login             - Login (retorna JWT)

```

**Exemplo Login:**
```json
{
  "email": "user@example.com",
  "senha": "password123"
}
```

### Contas

```
GET    /api/conta                  - Listar contas
POST   /api/conta                  - Criar conta
GET    /api/conta/{id}             - Obter conta
PUT    /api/conta/{id}             - Atualizar conta
DELETE /api/conta/{id}             - Deletar conta
```

### Transações

```
GET    /api/transacao              - Listar transações
POST   /api/transacao              - Criar transação
GET    /api/transacao/{id}         - Obter transação
PUT    /api/transacao/{id}         - Atualizar transação
DELETE /api/transacao/{id}         - Deletar transação
```

### Investimentos

```
GET    /api/investimento           - Listar investimentos
POST   /api/investimento           - Criar investimento
GET    /api/investimento/{id}      - Obter investimento
PUT    /api/investimento/{id}      - Atualizar investimento
DELETE /api/investimento/{id}      - Deletar investimento
```

### Metas

```
GET    /api/meta                   - Listar metas
POST   /api/meta                   - Criar meta
GET    /api/meta/{id}              - Obter meta
PUT    /api/meta/{id}              - Atualizar meta
DELETE /api/meta/{id}              - Deletar meta
POST   /api/meta/{id}/progresso    - Atualizar progresso
```

### Categorias

```
GET    /api/categoria              - Listar categorias
POST   /api/categoria              - Criar categoria
GET    /api/categoria/{id}         - Obter categoria
PUT    /api/categoria/{id}         - Atualizar categoria
DELETE /api/categoria/{id}         - Deletar categoria
```

### Usuário

```
GET    /api/usuario                - Obter perfil
PUT    /api/usuario                - Atualizar perfil
```

---

## 🔐 Autenticação JWT

### Fluxo de Autenticação

1. **Login** - Usuário envia credenciais
2. **Token Gerado** - Backend retorna JWT com expiração de 24h
3. **Requisições** - Token é enviado no header `Authorization: Bearer <token>`
4. **Validação** - Cada requisição valida o token


---

## 🏗️ Arquitetura em Camadas

```
Controller (REST Endpoints)
     ↓
Service (Business Logic)
     ↓
Repository (Data Access - JPA)
     ↓
Entity/Model (Database)
```

Cada camada tem responsabilidades bem definidas:

- **Controller**: Recebe requisições HTTP, valida e chama services
- **Service**: Contém lógica de negócio e orquestração
- **Repository**: Comunica com o banco de dados
- **Entity**: Mapeia tabelas do banco

---

## 🚀 Build & Deploy

### Build Local

```bash
mvn clean package
java -jar target/orcapro-*.jar
```

---

## 📚 Recursos

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [PostgreSQL](https://www.postgresql.org/docs)

---

<div align="center">

**[🔙 Voltar ao Repositório Principal](../README.md)**

</div>
