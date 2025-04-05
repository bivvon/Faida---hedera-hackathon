# Faida Investment Platform Backend

A comprehensive backend service for the Faida Investment Platform, providing portfolio management, risk assessment, and market data integration.

## Features

- User authentication and authorization
- Portfolio management
- Investment tracking
- Risk assessment
- Market data integration
- Real-time notifications
- AI-powered recommendations
- Transaction processing
- Caching layer
- Monitoring and logging

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Redis (v7 or higher)
- Docker and Docker Compose (optional)
- API keys for:
  - CoinGecko
  - Moralis
  - Llama.fi

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/faida-backend.git
cd faida-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Start the development server:
```bash
npm run dev
```

## Docker Setup

1. Build and start containers:
```bash
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f
```

## API Documentation

API documentation is available at `/api-docs` when the server is running. The documentation includes:

- Authentication endpoints
- Portfolio management
- Investment tracking
- Risk assessment
- Market data
- Transaction processing

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run integration tests:
```bash
npm run test:integration
```

## Security

The application includes several security features:

- JWT authentication
- Input validation
- Rate limiting
- CORS protection
- Helmet security headers
- Request sanitization
- API key management
- Audit logging

## Monitoring

The application includes monitoring and logging:

- Request logging
- Error tracking
- Performance metrics
- Health checks
- Real-time alerts

## Development

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "Description of your changes"
```

3. Push your changes:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

## Deployment

The application is configured for deployment using GitHub Actions:

1. Set up repository secrets:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
   - `SSH_HOST`
   - `SSH_PRIVATE_KEY`

2. Push to main branch to trigger deployment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@faida.com or create an issue in the repository. 