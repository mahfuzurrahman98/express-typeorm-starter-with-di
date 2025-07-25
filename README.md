# Express TypeScript TypeORM Starter

A scalable, production-ready API starter template using:

-   Express.js
-   TypeScript
-   TypeORM (PostgreSQL)
-   tsyringe (Dependency Injection)
-   OOP principles

## Features

-   Modular architecture: controllers, services, repositories, DTOs, entities
-   Dependency injection for testability and decoupling
-   Centralized error handling
-   Environment variable management
-   EJS templating support
-   Static file serving from `/public`
-   Example entities: User, Post, Category
-   Example authentication flow (JWT)
-   Example seeders

## Getting Started

1. **Clone the repo**
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Configure environment**

    - Copy `.env.example` to `.env` and fill in required values.

4. **Run migrations**

    ```bash
    npm run typeorm migration:run
    ```

5. **Start the app**
    ```bash
    npm run dev
    ```

## Project Structure

```
src/
  app/
    controllers/
    dtos/
    entities/
    middlewares/
    repositories/
    routes/
    schemas/
    services/
    templates/
  configs/
  lib/
  seeders/
  types/
  utils/
  index.ts
```

-   **controllers/**: Route handlers
-   **services/**: Business logic, injected via tsyringe
-   **repositories/**: TypeORM data access
-   **dtos/**: Data Transfer Objects (request/response shapes)
-   **entities/**: TypeORM entity definitions
-   **middlewares/**: Express middleware (auth, error, etc)
-   **routes/**: Route definitions (REST API)
-   **schemas/**: Zod schemas for validation
-   **templates/**: EJS templates for emails, etc

## Scripts

-   `npm run dev` — Start dev server with hot reload
-   `npm run build` — Compile TypeScript
-   `npm start` — Run compiled app
-   `npm run seed` — Run seeders
-   `npm run typeorm` — Run TypeORM CLI

## Improvements & TODOs

-   [ ] Add automated tests (Jest/Mocha)
-   [ ] Add API docs (Swagger)
-   [ ] Add logger (winston/pino)
-   [ ] Add security middleware (helmet)
-   [ ] Add CI/CD pipeline
-   [ ] Add rate limiting

## License

MIT
