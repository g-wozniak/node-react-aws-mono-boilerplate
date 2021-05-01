# Boilerplate

This is a foundation for Node/React/Aws monolith application to quickly spin off a production ready app with all levels of tests and integration.

# What is included?
- Node server supporting api and web application
- Smooth configuration across various environments
- Unit testing of the core module, api, react components (Jest + React Testing Library) and browser level (Testcafe + React Testing Library), all integrated
- MongoDB simulator and support with Mongoose
- Email service via Sendgrid
- A bit more bespoke logging that helps tracking request chain and does not leave a mess
- Types via Typescript
- SASS into CSS compression
- Dockerization and AWS task definitions
- Webapp application supporting Brotli and Gzip compression
- Webapp translations
- Well resolved requests lifecycle to support chain requests and granular actions in React App lifecycle
- Linting

# What is missing?
- OpenAPI docs etc.
- Prettier if someone uses it
- Business logic :)


# Licence
You can reuse it how you like. MIT