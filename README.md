# TaskTide

A modern task management application built with Next.js and integrated with a Spring Boot backend API.

## Features

- **Task Management**: Create, update, delete, and toggle task completion
- **Kanban Board**: Drag and drop tasks between different status columns (Todo, In Progress, Done)
- **Task List**: Clean list view with filtering by completion status
- **Real-time Updates**: All changes are synchronized with the backend API
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java Spring Boot backend running on `http://localhost:8080`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TaskTide
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API endpoint:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and set your API base URL:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:9002](http://localhost:9002) in your browser.

## API Integration

TaskTide integrates with a Spring Boot backend that provides the following endpoints:

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update an existing task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/done` - Mark a task as completed

The application automatically handles API errors and displays user-friendly error messages.
