<h1 align="center">
    Cryptodistrict
</h1>

<h2 align="center">
    Where we make WEB3 real
</h2>

### Table of contents
1. [About project implementation](#about-project-implementation)
2. [Endpoints](#endpoints)
3. [Documentation](#documentation)
4. [Logging implementation](#logging-implementation)
5. [Database](#database)
6. [Contact and references](#contact-and-references)
7. [License](#license)

### About project implementation

Nest.js is a popular framework for building web applications and APIs using TypeScript. It is built on top of Node.js and Express and offers a powerful set of features for building robust and scalable applications.

One of the main advantages of Nest.js is its use of TypeScript. TypeScript is a strongly typed superset of JavaScript that provides a number of benefits, such as improved code quality and maintainability. TypeScript's static typing system allows developers to catch errors early on, before the code is executed, which can save time and improve the overall quality of the code. It also provides better code organization and structure, making it easier to navigate and maintain large codebases.

Another advantage of Nest.js is its modular structure. Nest.js uses a modular approach to organizing code, allowing developers to organize their code into smaller, reusable modules. This can make it easier to manage and maintain large codebases, as well as make it more manageable to add new features or make changes without introducing bugs.

Nest.js also offers powerful features for building scalable and performant APIs. It provides built-in support for common API functionality such as validation, authentication, and error handling. This can save developers time and effort and make it easier to build high-quality APIs.

In addition, Nest.js has a large and active community, which means that there is a wealth of knowledge and resources available to developers. This can make it easier to get help and find solutions to common problems.

In conclusion, Nest.js is a powerful framework for building web applications and APIs using TypeScript. Its use of TypeScript provides improved code quality and maintainability, its modular structure allows for better scalability and organization, and it offers built-in support for common API functionality. With a strong community, Nest.js is a solid choice for developers looking to build robust, scalable, and performant web applications and APIs.

One important detail of the whole API implementation is that it has been done using Docker image created in order
to join database and API in one container with externally exposed ports.

### Endpoints

There are 5 main controllers that have been implemented - `Auth`, `Crypto`, `Phone`, `TwoFactor`, `User`.
Every controller is responsible for handling requests and responses of its zone of responsibility.
Here is the list of endpoints that have been implemented for every controller.

- `Auth`
  -
  - `GET /refresh` - endpoint is responsible for refreshing user's tokens.

- `Crypto`
  - 
  - `GET /all/:page/:limit/:sort` - gets all assets from database. Requires params `page` and `limit` for pagination and `sort` for type of sorting.
  - `GET /coin/:name` - gets 1 coin from database by name
  - `POST /favorite/add` - if user authenticated, adds a coin to favorite list
  - `POST /favorite/remove` - if user authenticated, removes a coin to favorite list
  - `GET /all-favorites`- if user authenticated, gets all coins from favorite list
  
- `Phone`
- `TwoFactor`
- `User`

More information you can find in folder with [documentation](docs) or by using `/docs` endpoint for API.

**P.S.** `/docs` endpoint doesn't require any authentication. It has been excluded from middleware.

### Documentation

Swagger and OpenAPI are both industry-standard specifications for describing RESTful APIs. They allow developers to define the structure and behavior of an API, including the endpoints, request and response formats, and authentication methods.

Swagger, now known as the OpenAPI specification, is a set of rules and conventions for creating machine-readable API documentation. It provides a format for describing RESTful APIs and includes tools for generating interactive documentation, client libraries, and server stubs. Swagger was developed by Tony Tam and his team at Reverb Technologies and was later donated to the OpenAPI initiative, which is now maintained by the Linux foundation.

OpenAPI, formerly known as the Swagger specification, is the open-source implementation of the specification. It is a specification for building APIs, and it provides a simple and uniform way for describing the RESTful APIs. OpenAPI is a specification and not a framework, it can be used with any framework or language, and it has a wide range of tools and libraries to support it. It is used by many companies and organizations to document and test their APIs.

Documentation for this API is available under `/api/docs` URL address.

### Logging implementation

`Winston` is a popular logging library for Node.js. It is designed to be simple and flexible, making it easy to integrate into any application. It supports multiple transports, or methods of storing and displaying log messages, such as console, file, and HTTP. Winston also allows for custom transports to be added, giving developers full control over how log messages are handled.

`Winston-daily-rotate-file` is a Winston transport that allows log files to be rotated on a daily basis. This means that a new log file will be created each day, and the previous day's log file will be archived. This can be useful for applications that generate a large amount of log data, as it helps to keep the log files manageable and prevent them from growing too large. Additionally, the package can be configured to set a maximum number of logs to keep, useful for long-running applications that want to avoid disk space issues.

With `winston-daily-rotate-file`, you can also set a filename format, which is used to generate the names of the log files. The package also supports archiving logs in different formats, such as .gz or .zip, which can save disk space.

In summary, `Winston` is a flexible and powerful logging library for Node.js, and `winston-daily-rotate-file` is a transport for Winston which allows log files to be rotated on a daily basis, making it easy to manage and archive log data, and preventing disk space issues.

Moreover, using `winston-mongodb` and `MongoDB` was implemented logging of critical error. If such error happens,
instead of writing it to local log file, `winston-mongodb` sends this error log to `MongoDB`.

### Database

Database has been implemented as a PostgreSQL server within Docker container which allows not to install
and configure server locally. Database has been joined with API within Docker container within the same network.
It allows to use containers' names to make sure that database can communicate with API without any issues.

```yaml
version: '3.8'

services:
  api:
    container_name: cryptodistrict-api
    restart: always
    build:
      context: .
      target: development
      dockerfile: ./Dockerfile
    env_file:
      - .env.development
    command: npm run start:dev
    volumes:
      - ./:/usr/src/cryptodistrict_api
    ports:
      - "3000:3000"
    depends_on:
      - db
    networks:
      - cryptodistrict-api-network
  db:
    image: postgres
    container_name: cryptodistrict-api-db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: cryptodistrict
    volumes:
      - /:/data/postgres
    networks:
      - cryptodistrict-api-network

networks:
  cryptodistrict-api-network:
    driver: bridge
```

### Contact and references

- Developer contact - [contact@mikhailbahdashych.me](mailto:contact@mikhailbahdashych.me)
- Project's front-end - [repository link](https://github.com/bl4drnnr/cryptodistrict-front)
- Project's infrastructure - [repository link](https://github.com/bl4drnnr/cryptodistrict-infrastructure)

### License

Licensed by [MIT licence](LICENSE).

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
