# API Specification (REST)

## 1. Authentication & Security
### Auth Strategy: JWT with Rotation
- **Access Token**: Short-lived (15m), sent in `Authorization: Bearer` header.
- **Refresh Token**: Long-lived (7d), sent in `HttpOnly; Secure; SameSite=Strict` cookie.
- **Rotation**: Refresh token is rotated on every use to prevent replay attacks.

### Endpoints

| Method | Endpoint | Description | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| POST | `/auth/login` | Login with email/password. Returns access token + sets cookie. | Public | 5/min |
| POST | `/auth/refresh` | Exchange cookie for new access token. | Cookie | 10/min |
| POST | `/auth/logout` | Clear cookie and blacklist token. | Bearer | 20/min |
| GET | `/auth/me` | Get current user profile & permissions. | Bearer | 60/min |
| POST | `/auth/forgot-password` | Trigger reset email. | Public | 3/hour |
| POST | `/auth/reset-password` | Set new password with token. | Public | 5/hour |

### Security Headers
All responses must include:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: default-src 'self';`

## 2. Users & Profile

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| PUT | `/users/profile` | Update profile info | Self |
| PUT | `/users/password` | Change password | Self |
| GET | `/users` | List all users (Paginated, Filterable) | Admin/HR |
| POST | `/users` | Create new user (Internal/Client) | Admin |
| GET | `/users/:id` | Get user details | Admin/Self |
| DELETE | `/users/:id` | Soft delete user | Admin |

## 3. CRM (Clients & Inquiries)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/clients` | List clients (Paginated, Filterable) | Internal (All) |
| GET | `/clients/:id` | Get client details | Internal (All), Client Admin (Self) |
| POST | `/clients` | Create new client | Sales/Admin |
| PUT | `/clients/:id` | Update client info | Sales/Admin, Client Admin (Self) |
| GET | `/inquiries` | List inquiries | Sales/Admin |
| POST | `/inquiries` | Submit new inquiry | Public/Client |
| PATCH | `/inquiries/:id/status` | Update inquiry status | Sales/Admin |

## 3. Projects & Workflow

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/projects` | List projects | Internal (All), Client (Self) |
| GET | `/projects/:id` | Get project details | Internal (All), Client (Self) |
| POST | `/projects` | Create project (from contract) | PM/Admin |
| GET | `/projects/:id/milestones` | Get project milestones | Internal (All), Client (Self) |
| POST | `/projects/:id/milestones` | Add milestone | PM/Admin |
| GET | `/projects/:id/tasks` | Get project tasks | Internal (All), Client (Self-Visible) |
| POST | `/projects/:id/tasks` | Create task | PM/Dev |
| PATCH | `/tasks/:id/status` | Update task status | PM/Dev |
| POST | `/projects/:id/revisions` | Request revision | Client/PM |

## 4. Finance (Invoicing)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/invoices` | List invoices | Finance/Admin, Client (Self) |
| GET | `/invoices/:id` | Get invoice details | Finance/Admin, Client (Self) |
| POST | `/invoices` | Generate invoice (Draft) | Finance/Admin |
| POST | `/invoices/:id/send` | Send invoice via email | Finance/Admin |
| POST | `/invoices/:id/pay` | Record payment (Manual) | Finance/Admin |
| POST | `/payments/callback` | Payment Gateway Callback | Public (Webhook) |

## 5. Support

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/tickets` | List tickets | Support/Admin, Client (Self) |
| POST | `/tickets` | Create support ticket | Client/Internal |
| GET | `/tickets/:id` | Get ticket conversation | Support/Admin, Client (Self) |
| POST | `/tickets/:id/messages` | Reply to ticket | Support/Admin, Client (Self) |
| PATCH | `/tickets/:id/status` | Close/Reopen ticket | Support/Admin, Client (Self) |

## 6. Infrastructure

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/domains` | List domains | Infra/Admin, Client (Self) |
| POST | `/domains` | Register/Add domain | Infra/Admin |
| GET | `/hosting` | List hosting services | Infra/Admin, Client (Self) |

## Standard Response Format (JSend-compliant)

All API responses strictly follow the JSend specification with typed data payloads.

**Success (200 OK)**
```json
{
  "status": "success",
  "data": {
    "user": { "id": "uuid...", "email": "..." }
  },
  "meta": { 
    "timestamp": "2023-10-27T10:00:00Z",
    "version": "v1"
  }
}
```

**Success with Pagination**
```json
{
  "status": "success",
  "data": {
    "items": [ ... ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total_items": 100,
      "total_pages": 5,
      "next_cursor": "eyJpZCI6... (optional for cursor-based)"
    }
  }
}
```

**Fail (4xx - Client Error)**
```json
{
  "status": "fail",
  "data": {
    "email": "Email is already taken",
    "password": "Password is too short"
  },
  "message": "Validation failed"
}
```

**Error (5xx - Server Error)**
```json
{
  "status": "error",
  "message": "Unable to connect to database",
  "code": "DB_CONNECTION_ERROR",
  "trace_id": "req-12345-abcde" 
}
```

## 7. OpenAPI / Swagger Specification (Example)

The API is fully documented using OpenAPI 3.0. Below is the core definition structure.

```yaml
openapi: 3.0.0
info:
  title: Agency Operations API
  version: 1.0.0
  description: Core API for Internal Operations and Client Portal
servers:
  - url: https://api.agency.com/v1
    description: Production Server
  - url: http://localhost:3000/v1
    description: Local Development
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    cookieAuth:
      type: apiKey
      in: cookie
      name: refresh_token
  schemas:
    Project:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        status:
          type: string
          enum: [planning, in_progress, completed]
```
