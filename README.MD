<!-- @format -->

# E-commerce Backend API

This project provides a secure and scalable backend service for an e-commerce application. It offers a set of APIs that allow users to authenticate, manage their profiles, browse products, write reviews, and place orders.

## Live Demo

The project is deployed at [https://e-commerce-api-3hxd.onrender.com/](https://e-commerce-api-3hxd.onrender.com/)

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Middleware for security (XSS, NoSQL injection protection, rate limiting)

The project is built using Node.js, Express.js, and MongoDB, a popular combination for building efficient and scalable server-side applications. It uses JWT for authentication and various middleware for protection against common web vulnerabilities such as XSS and NoSQL injection. It also uses rate limiting to prevent abuse. The project is structured around the MVC (Model-View-Controller) pattern, with clear separation between routes, controllers, and models.

## Achievements

The project has achieved a robust backend infrastructure capable of handling diverse e-commerce requests. The use of middleware for security and rate limiting ensures the application is protected against common web attacks and abuse. The use of JWT for authentication provides a stateless and scalable solution for user authentication. The project's structure and use of MVC pattern make it maintainable and easy to extend with new features.

## Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up your environment variables in a `.env` file in the root of your project. You'll need:
   - `MONGO_URL`: Your MongoDB connection string.
   - `JWT_SECRET`: A secret key for JWT signing.
   - `PORT`: The port your server will run on. Defaults to 5000 if not provided.
4. Start the server with `npm start`.

## API Endpoints

- `/api/v1/auth`: Authentication routes.
- `/api/v1/users`: User profile management routes.
- `/api/v1/products`: Product browsing routes.
- `/api/v1/reviews`: Review routes.
- `/api/v1/orders`: Order placement and management routes.

## Contact

Your Name - devashish.cs025@gmail.com
