# Fastify TypeScript Application with Drizzle ORM

A production-ready Fastify TypeScript application using Drizzle ORM for PostgreSQL.

## Features

- **Fastify**: Fast and low overhead web framework
- **TypeScript**: Full TypeScript support with strict mode
- **Drizzle ORM**: Type-safe SQL toolkit and query builder
- **PostgreSQL**: Robust relational database
- **Zod**: Runtime type validation
- **Docker**: Container support for deployment
- **Security**: Helmet, CORS, and rate limiting
- **Documentation**: Auto-generated Swagger/OpenAPI docs
- **Health Checks**: Kubernetes-ready health endpoints
- **Error Handling**: Production-ready error management
- **Logging**: Structured logging with Pino

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database configuration:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```

### Database Setup

1. Generate database migrations:
   ```bash
   npm run db:generate
   ```

2. Run migrations:
   ```bash
   npm run db:migrate
   ```

### Development

Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:3000`

- API Documentation: `http://localhost:3000/docs`
- Health Check: `http://localhost:3000/health`

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## Docker Deployment

### Using Docker Compose

```bash
docker-compose up -d
```

This will start both the application and PostgreSQL database.

### Building Docker Image

```bash
docker build -t fastify-app .
```

## API Endpoints

### Health Endpoints
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness probe (includes DB check)
- `GET /health/live` - Liveness probe

### User Endpoints
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Database Commands

- `npm run db:generate` - Generate migrations from schema changes
- `npm run db:push` - Push schema changes directly to database
- `npm run db:migrate` - Run pending migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `LOG_LEVEL` | Log level | `info` |

## Production Considerations

This application includes production-ready features:

- **Security**: Helmet for security headers, CORS configuration, rate limiting
- **Monitoring**: Structured logging, health checks
- **Performance**: Connection pooling, query optimization
- **Deployment**: Docker support, graceful shutdown
- **Error Handling**: Comprehensive error management
- **Validation**: Request/response validation with Zod
- **Documentation**: Auto-generated API docs

## Architecture

```
src/
├── db/
│   ├── connection.ts    # Database connection setup
│   ├── migrate.ts       # Migration runner
│   └── schema.ts        # Database schema definitions
├── routes/
│   ├── health.ts        # Health check endpoints
│   └── users.ts         # User CRUD operations
├── types/
│   └── env.ts           # Environment validation
├── utils/
│   └── logger.ts        # Logging configuration
└── server.ts            # Main application setup
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT