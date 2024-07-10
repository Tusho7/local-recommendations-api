## Local Recommendation's Platform API

### Table of Contents

- [Prerequisites](#Prerequisites)
- [Tech Stack](#Tech-Stack)
- [Getting Started](#Getting-Started)
- [Project Structure](#Project-Structure)

#

### Prerequisites

- <img src="./readme/nodejs.png" width="25" style="top: 8px" /> Node JS @16.X and up
- <img src="./readme/npm.png" width="25" style="top: 8px" /> npm @8 and up

#

### Tech Stack

- <img src="./readme/bcrypt.jpeg" width="25" style="top: 8px" /> bcrypt @ 5.1.1 - Library for hashing passwords.
- <img src="./readme/cookie-parser.png" width="25" style="top: 8px" /> cookie-parser @ 1.4.6 - Middleware for parsing cookies.
- <img src="./readme/cors.png" width="25" style="top: 8px" /> cors @ 2.8.5 - Middleware for enabling CORS in Express.
- <img src="./readme/dotenv.png" width="25" style="top: 8px" /> dotenv @ 16.4.5 - Zero-dependency module for loading environment variables.
- <img src="./readme/express.png" width="25" style="top: 8px" /> express @ 4.19.2 - Web framework for Node.js.
- <img src="./readme/jsonwebtoken.png" width="25" style="top: 8px" /> jsonwebtoken @ 9.0.2 - Library for generating JWTs.
- <img src="./readme/nodemailer.webp" width="25" style="top: 8px" /> nodemailer @ 6.9.14 - Module for sending emails.
- <img src="./readme/pg.webp" width="25" style="top: 8px" /> pg @ 8.12.0 - PostgreSQL client for Node.js.
- <img src="./readme/pg.webp" width="25" style="top: 8px" /> pg-hstore @ 2.3.4 - Serializes and deserializes JSON data to hstore format for PostgreSQL.
- <img src="./readme/sequelize.png" width="25" style="top: 8px" /> sequelize @ 6.37.3 - Promise-based ORM for Node.js.
- <img src="./readme/uuid.png" width="25" style="top: 8px" /> uuid @ 10.0.0 - Generates UUIDs.
- <img src="./readme/ws.jpg" width="25" style="top: 8px" /> ws @ 8.17.1 - Simple to use, blazing fast and thoroughly tested websocket client, server and console for node.js

#

### Getting Started

1. First of all you need to clone app repository from github:

```
git clone https://github.com/your-username/local-recommendations-api.git
```

2. Next step requires install all dependencies.

```
npm install
```

3. Also you need to create .env file where copy information from .env.example file

```
Create a .env file based on the .env.example template.
Update the variables with your PostgreSQL database connection URI and other configuration settings.
```

### Project Structure

```
src
├── config          # Configuration files
├── controllers     # Controller files
├── middlewares     # Middleware functions
├── models          # Database models
├── routes          # Router files
├── utils           # Utility functions
└── server.js       # Main server file

```

### Config: Contains configuration files such as database connection setup.

### Controllers: Handles business logic, interacting with models and returning responses.

### Middlewares: Includes middleware functions for handling requests before they reach the routes.

### Models: Defines data models using Sequelize for interacting with PostgreSQL.

### Routes: Defines API routes and their corresponding controller methods.

### Utils: Utility functions used across the application.

### Server.js: Entry point file that initializes and starts the Express server.

Feel free to adjust the sections and details according to your specific project setup and requirements. This README template provides a clear structure and instructions for setting up and understanding your Local Recommendation's Platform API project.
