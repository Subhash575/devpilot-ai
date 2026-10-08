# DevPilot AI

DevPilot AI is a lightweight, open-source developer assistant designed to help developers understand, analyze, debug, and improve their code.

The project provides a simple web interface connected to a Node.js and Express REST API. The current version uses a mock AI response while the AI integration layer is being developed.

## Features

- Submit JavaScript, Node.js, or SQL code
- Ask questions about submitted code
- Simple web-based developer assistant
- REST API built with Node.js and Express
- Lightweight frontend using HTML, CSS, and JavaScript
- JSON-based API requests and responses
- CORS-enabled backend
- Environment variable support
- Designed for future Claude API integration

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

### Backend

- Node.js
- Express.js
- CORS
- dotenv

### AI Integration

DevPilot AI is designed to support integration with the Anthropic Claude API.

The current version does not require an Anthropic API key and uses a temporary mock response.

## Project Structure

```text
devpilot-ai/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── .gitignore
└── README.md
```

## Prerequisites

Before running DevPilot AI locally, make sure you have installed:

- Node.js
- npm
- Git

You can verify your Node.js installation:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

Verify Git:

```bash
git --version
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Subhash575/devpilot-ai.git
```

Navigate into the project:

```bash
cd devpilot-ai
```

Navigate to the backend:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` directory:

```text
backend/.env
```

The current version does not require an Anthropic API key.

When Claude API integration is added, the required environment variable will be configured here.

For example:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

Never commit your `.env` file or API keys to GitHub.

The `.env` file should remain ignored by Git through `.gitignore`.

## Running the Backend

From the `backend` directory, run:

```bash
node server.js
```

The server should start at:

```text
http://localhost:5000
```

You should see:

```text
DevPilot AI server running on http://localhost:5000
```

## Running the Frontend

After starting the backend, open:

```text
frontend/index.html
```

in your web browser.

The frontend communicates with the backend API running at:

```text
http://localhost:5000
```

## API Documentation

### POST /api/explain

The `/api/explain` endpoint accepts source code and a question.

### Request

```http
POST /api/explain
Content-Type: application/json
```

### Request Body

```json
{
  "code": "const x = 10; console.log(x);",
  "question": "Explain this code"
}
```

### Example Using cURL

```bash
curl -X POST http://localhost:5000/api/explain -H "Content-Type: application/json" -d '{"code":"const x = 10; console.log(x);","question":"Explain this code"}'
```

### Response

```json
{
  "success": true,
  "response": "This is a temporary DevPilot AI response..."
}
```

## Current Implementation

The current version contains a working backend API and frontend interface.

The `/api/explain` endpoint currently returns a mock response instead of calling an external AI model.

This allows the application architecture and API communication flow to be developed and tested without requiring an AI API key.

## Claude API Integration

A future version of DevPilot AI will integrate the Anthropic Claude API.

The planned application flow is:

```text
User
  |
  v
DevPilot AI Frontend
  |
  v
Node.js / Express Backend
  |
  v
Claude API
  |
  v
AI Response
  |
  v
DevPilot AI Frontend
```

The backend will communicate with Claude so that API credentials are not exposed in the browser.

## Roadmap

### Phase 1 - Project Foundation

- [x] Node.js backend
- [x] Express REST API
- [x] Frontend interface
- [x] Code submission
- [x] Question submission
- [x] API request and response flow
- [x] Basic error handling

### Phase 2 - AI Integration

- [ ] Integrate Claude API
- [ ] Generate real code explanations
- [ ] Add debugging assistance
- [ ] Add code improvement suggestions
- [ ] Add SQL query explanations

### Phase 3 - Developer Tools

- [ ] Code review
- [ ] Bug detection
- [ ] Refactoring suggestions
- [ ] Code documentation generation
- [ ] Multiple programming language support

### Phase 4 - User Experience

- [ ] Improved code editor
- [ ] Syntax highlighting
- [ ] Response formatting
- [ ] Conversation history
- [ ] Improved mobile experience

## Security

DevPilot AI is designed with the following security principles:

- API credentials should be stored in environment variables.
- API keys should never be placed in frontend JavaScript.
- `.env` files should not be committed to Git.
- The backend acts as the server-side layer between the frontend and external AI services.

Before deploying the application publicly, additional production security measures should be implemented, including authentication, rate limiting, input validation, logging, and appropriate API access controls.

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test the application locally.
5. Commit your changes:

```bash
git commit -m "Add your feature"
```

6. Push your branch:

```bash
git push origin feature/your-feature
```

7. Open a pull request.

## Reporting Issues

If you find a bug or have a feature request, please open an issue in the GitHub repository.

When reporting a bug, include:

- Description of the problem
- Steps to reproduce it
- Expected behavior
- Actual behavior
- Relevant error messages
- Operating system
- Node.js version

## License

This project is licensed under the MIT License.

## Project Status

DevPilot AI is currently an early-stage open-source project.

The core application structure and API communication flow are implemented. AI functionality is currently represented by a mock response, with Claude API integration planned as the next development stage.

---

Built with Node.js, Express, JavaScript, and a focus on making developer tools simple and accessible.
