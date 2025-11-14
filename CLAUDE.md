# CLAUDE.md - SpecialNeeds Admin

This file provides context for AI assistants working with the SpecialNeeds Admin repository.

## Repository Overview

**Repository:** specialneeds-admin
**Purpose:** CMS for service providers to manage their listings
**URL:** manage.specialneeds.com
**Tech Stack:** Refine.dev, React, Vite

## Project Context

This is the admin portal where service providers (schools, therapists, camps) manage their listings and business information. Providers log in here to:

- Update their service listings
- Add/edit business information
- Upload photos and documents
- Manage availability and schedules
- Respond to inquiries

This application is SEPARATE from:
- **Public directory** (specialneeds-client) - Read-only public interface
- **Platform admin** - Super admin functions (may be in Django admin)

## Architecture

### Tech Stack
- **Frontend Framework:** Refine.dev (React-based admin framework)
- **Build Tool:** Vite
- **Backend API:** api.specialneeds.com (Django REST API)
- **Authentication:** JWT-based auth with provider accounts

### Directory Structure
```
specialneeds-admin/
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── webroot/          # Refine.dev application
│   ├── src/
│   ├── public/
│   └── package.json
├── .env.example      # Environment variable template
└── README.md
```

## Development Environment

### Setup
```bash
cd webroot
npm install
npm run dev
```

### Dev Server Management

Use Python scripts in `./scripts/` to manage the dev server:

**Start the dev server:**
```bash
poetry run python scripts/start_dev.py
```
- Starts Vite dev server in background
- Saves PID to `.dev-server.pid`
- Logs output to `.dev-server.log`
- Server runs at:
  - http://manage.specialneeds.localhost:5173 (recommended)
  - http://localhost:5173

**Stop the dev server:**
```bash
poetry run python scripts/stop_dev.py
```

**Restart the dev server:**
```bash
poetry run python scripts/restart_dev.py
```

**When user requests to start/stop/restart dev server:**
- Use the appropriate script from `./scripts/`
- Run with `poetry run python scripts/<script_name>.py`
- Do NOT run `npm run dev` directly unless specifically requested

### Environment Variables
- See `.env.example` for required variables
- `VITE_API_ENDPOINT` - API URL (api.specialneeds.com)
- `VITE_JWT_SECRET_KEY` - JWT secret (if needed)
- Never commit actual `.env` files

## API Integration

### Authentication
- JWT-based authentication with provider accounts
- Login endpoint: `POST /api/auth/login/`
- Token refresh: `POST /api/auth/refresh/`
- Store token securely (httpOnly cookies or secure storage)

### API Endpoints
- **Production:** https://api.specialneeds.com
- **Staging:** https://stagingapi.specialneeds.com
- **Development:** https://devapi.specialneeds.com

## Deployment

- **Platform:** Vercel or static hosting (to be configured)
- **Deployment:** Manual deployment process
- **Build command:** `npm run build`
- **Output directory:** `webroot/dist`

## Important Notes for AI Assistants

### When Working on Features

1. **Refine.dev Patterns**
   - Use Refine's data provider for API calls
   - Use Refine's resource system for CRUD operations
   - Follow Refine's routing conventions
   - Use Refine's authentication hooks

2. **Authentication**
   - Check authentication status before rendering
   - Redirect to login if not authenticated
   - Handle token expiration gracefully
   - Secure all sensitive operations

3. **CRUD Operations**
   - Use Refine's useTable, useForm, useShow hooks
   - Implement proper validation
   - Handle loading and error states
   - Provide user feedback for actions

4. **Provider-Specific Data**
   - Filter data by authenticated provider
   - Don't show other providers' data
   - Implement proper authorization checks
   - Validate ownership before operations

5. **UI/UX**
   - Follow admin interface best practices
   - Make forms intuitive and clear
   - Provide helpful error messages
   - Implement proper loading states

### Common Patterns

**Creating a resource:**
```javascript
// App.tsx
import { Refine } from "@refinedev/core";
import dataProvider from "./dataProvider";
import authProvider from "./authProvider";
import { SchoolList, SchoolEdit, SchoolCreate } from "./pages/schools";

function App() {
  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      resources={[
        {
          name: "schools",
          list: SchoolList,
          edit: SchoolEdit,
          create: SchoolCreate,
        },
      ]}
    />
  );
}
```

**Using Refine hooks:**
```javascript
// pages/schools/list.tsx
import { useTable } from "@refinedev/core";

export const SchoolList = () => {
  const { tableQueryResult } = useTable();
  const schools = tableQueryResult.data?.data || [];

  return (
    <div>
      {schools.map(school => (
        <div key={school.id}>{school.name}</div>
      ))}
    </div>
  );
};
```

**Form handling:**
```javascript
// pages/schools/edit.tsx
import { useForm } from "@refinedev/react-hook-form";

export const SchoolEdit = () => {
  const {
    refineCore: { formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit}>
      <input {...register("name", { required: true })} />
      {errors.name && <span>Name is required</span>}
      <button type="submit" disabled={formLoading}>
        Save
      </button>
    </form>
  );
};
```

### Debugging

- **Development server:** Check console for errors
- **Network tab:** Monitor API requests
- **Refine devtools:** Use Refine's built-in debugging
- **Authentication:** Check token validity and expiration

### Related Repositories

- **specialneeds-api** - Backend providing authentication and data
- **specialneeds-client** - Public-facing directory (separate UI)
- **specialneeds-services** - Background services
- **specialneeds-infrastructure** - Cloudflare Workers

### Key Files

- `webroot/vite.config.ts` - Vite configuration
- `webroot/package.json` - Dependencies
- `webroot/src/App.tsx` - Main Refine app configuration
- `.env.example` - Environment variables template

## Best Practices

1. **Security**
   - Validate all input on client and server
   - Never trust client-side data
   - Implement proper authorization checks
   - Secure sensitive data (passwords, tokens)

2. **User Experience**
   - Provide clear feedback for actions
   - Show loading states during operations
   - Handle errors gracefully with helpful messages
   - Make navigation intuitive

3. **Data Management**
   - Filter data by authenticated provider
   - Implement proper pagination for lists
   - Cache data appropriately
   - Handle optimistic updates

4. **Code Quality**
   - Follow Refine.dev best practices
   - Keep components focused and small
   - Write clear, maintainable code
   - Add comments for complex logic

## Common Tasks

### Adding a new resource (e.g., Events)
1. Create resource pages (list, edit, create, show)
2. Register resource in App.tsx
3. Configure data provider for new endpoint
4. Add navigation menu item
5. Test CRUD operations

### Implementing authentication
1. Configure auth provider with API
2. Implement login page
3. Handle token storage
4. Set up protected routes
5. Handle logout and token refresh

### Customizing forms
1. Use useForm hook from Refine
2. Add validation rules
3. Handle file uploads if needed
4. Implement proper error handling
5. Style with UI library

## Questions?

Refer to:
- Repository README.md
- Refine.dev documentation
- Project-wide docs/repository-guide.md
- specialneeds-api for API documentation
