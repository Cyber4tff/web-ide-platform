# WebIDE - Frontend API Client

A comprehensive HTTP client for the WebIDE API with TypeScript support and automatic error handling.

## Usage

```typescript
import { apiClient } from '@/lib/api'

// Fetch projects
const projects = await apiClient.get('/projects')

// Create project
const project = await apiClient.post('/projects', {
  name: 'My Project',
  description: 'A new project'
})

// Execute code
const result = await apiClient.post('/execute', {
  code: 'console.log("hello")',
  language: 'javascript'
})
```

## Features

- ✅ Automatic JWT token management
- ✅ Request/response interceptors
- ✅ Error handling & retry logic
- ✅ Type-safe API calls
- ✅ Timeout configuration
- ✅ CORS support
