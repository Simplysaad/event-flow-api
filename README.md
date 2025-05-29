
---

# event-flow-api

A robust Node.js API for managing events attendance . This project provides configurable endpoints for handling event-related actions, making it suitable for use in modern web applications or as a backend microservice.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Event creation, retrieval, update, and deletion
- Configurable server and event management
- Example usage script provided
- Built with extensibility and modularity in mind

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Simplysaad/event-flow-api.git
cd event-flow-api
npm install
```

## Configuration

Configuration files are managed in the `Config/` directory. Add or modify configuration files as needed for your environment (e.g., database, environment variables).

## Usage

Start the server with:

```bash
npm run dev
```

## API Endpoints

- `POST /events` – Create a new event
- `GET /events` – List all events
- `PUT /events/:id` – Update an event
- `GET /events/:eventId/dashboard` - Get informatiom about a specific event
- `GET /events/:eventId` – Retrieve a single event
- `DELETE /events/:id` – Delete an event
- `POST /events/:eventId/attendance` - Register attendance
- `POST /register` - create a new organizer account
- `POST /login` - login to organizer account

## Project Structure

```
.
├── Config/             # Configuration files
├── Server/             # Server-side application logic
├── example.js          # Example usage script
├── index.js            # Main entry point
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Dependency lock file
├── .gitignore          # Git ignore rules
├── LICENSE             # Project license
└── README.md           # Project documentation
```

## Development

To contribute or run in development mode:

1. Fork the repository
2. Create a feature branch:  
   `git checkout -b feature/your-feature`
3. Commit your changes  
   `git commit -am "Add new feature"`
4. Push to your branch  
   `git push origin feature/your-feature`
5. Open a Pull Request

## Testing

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an [issue](http://github.com/simplysaad/issues "issues") or submit a pull request.

## License

This project is licensed under the terms of the [LICENSE](./LICENSE) file.

---