# SpecialNeeds Admin

The SpecialNeeds Admin application is a provider-facing CMS where service providers (schools, therapists, camps) manage their business listings on SpecialNeeds.com. Providers log in to update their service information, upload media, manage availability, and respond to inquiries. This is separate from the public directory (specialneeds-client) and the internal platform admin (Django admin).

Built with Refine.dev (React admin framework) and Vite, the admin portal integrates with the SpecialNeeds API (api.specialneeds.com) for authentication and data operations. It is deployed at manage.specialneeds.com and provides a secure, role-based interface for providers to control their presence on the platform.

## Dev Server

```bash
poetry run python scripts/start_dev.py    # start
poetry run python scripts/stop_dev.py     # stop
poetry run python scripts/restart_dev.py  # restart
```

## Quick Reference

- **[Architecture](docs/architecture.md)** — Tech stack, directory structure, API integration, and related repositories
- **[Development](docs/development.md)** — Environment setup, dev server management scripts, environment variables, and debugging
- **[Refine Patterns](docs/refine-patterns.md)** — Code examples for resources, hooks, and form handling with Refine.dev
- **[Guidelines](docs/guidelines.md)** — Best practices for authentication, CRUD operations, security, and code quality
- **[Common Tasks](docs/common-tasks.md)** — Step-by-step instructions for adding resources, implementing auth, and customizing forms
- **[Messages Inbox](docs/messages-inbox.md)** — Staff unified inbox for conversations (support, appeals, contact)
- **[Conversations System](../docs/specialneeds-api/conversations-system.md)** — Private threaded messaging for support, moderation appeals, and provider contact
- **[Deployment](docs/deployment.md)** — Build configuration and deployment process
