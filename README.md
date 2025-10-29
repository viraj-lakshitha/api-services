# API Services - Server Setup

## Prerequisites

Before setting up the server on your local environment, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Yarn** (v1.22 or higher)

## Local Environment Setup

### 1. Install Dependencies

```bash
yarn install
```

This will install all the required packages defined in `package.json`.

### 2. Run the Development Server

```bash
# Start the server in development mode with watch
yarn run start:dev
```

The server will start on `http://localhost:3000` by default.

### 3. Alternative Run Modes

```bash
# Start the server in development mode
yarn run start

# Start the server in production mode
yarn run start:prod
```

### 4. Environment Variables

If you need to customize the port, you can set the `PORT` environment variable:

```bash
PORT=4000 yarn run start:dev
```

The default port is `3000`.

## Verify Server is Running

Once the server is running, you can verify it's working by testing an endpoint:

```bash
curl -X POST http://localhost:3000/dns/lookup \
  -H "Content-Type: application/json" \
  -d '{"domain": "google.com"}'
```

A successful response will return DNS lookup results for the specified domain.

## Linting

To check and fix any code quality issues:

```bash
# Run ESLint
yarn run eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## Testing

```bash
# Run unit tests
yarn run test

# Run tests with coverage
yarn run test:cov

# Run e2e tests
yarn run test:e2e
```
