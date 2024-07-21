## Installation

```bash
$ npm install
```

## Environment Variables

The following environment variables are required to run the application:

- `MONGO_DB_URI`: The URI for the MongoDB database.
- `REDIS_PORT`: The port number for the Redis server.
- `REDIS_HOST`: The host of the Redis server.
- `OPENAI_API_KEY` : The open ai api secret key.

Please make sure to set these variables before running the application.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
