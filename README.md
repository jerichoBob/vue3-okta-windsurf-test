# Vue 3 + Okta Authentication Boilerplate

A Vue 3 boilerplate application demonstrating Okta authentication integration with a clean login dialog and group-based authorization.

[![GitHub stars](https://img.shields.io/github/stars/jerichoBob/vue3-okta-windsurf-test?style=social)](https://github.com/jerichoBob/vue3-okta-windsurf-test)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jerichoBob/vue3-okta-windsurf-test/blob/main/LICENSE)

note: built using [Windsurf Editor](https://codeium.com/windsurf) + Claude3.5 Sonnet (new)

## Features

- Vue 3 with Composition API
- Vite for fast development
- Okta authentication with username/password login dialog
- Group-based authorization
- Protected routes
- Modern, responsive UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Okta Developer Account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone git@github.com:jerichoBob/vue3-okta-windsurf-test.git
cd vue3-okta-windsurf-test

# Install dependencies
npm install
```

### 2. Okta Configuration

1. Create a free Okta Developer Account at https://developer.okta.com/signup/
2. Create a new OIDC Application in Okta:
   - Application type: Single-Page Application
   - Login redirect URIs: http://localhost:5173/login/callback
   - Logout redirect URIs: http://localhost:5173
   - Grant types: Authorization Code, Implicit

3. Configure Trusted Origins:
   - Go to Security > API > Trusted Origins
   - Add http://localhost:5173 as a trusted origin
   - Enable both CORS and Redirect

4. Configure Groups (Optional):
   - Create groups in Okta (Security > Groups)
   - Assign users to groups
   - Update authorization rules in `router/index.js` based on your groups

### 3. Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your Okta configuration:
```
VITE_OKTA_ISSUER=https://your-domain.okta.com/oauth2/default
VITE_OKTA_CLIENT_ID=your-client-id
VITE_APP_BASE_URL=http://localhost:5173
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at http://localhost:5173

## Project Structure

```
src/
├── components/             # Vue components
│   ├── LoginDialog.vue     # Login modal component
│   ├── LoginCallback.vue   # Handles auth callback
│   └── HelloWorld.vue      # Example component
├── views/                  # Page components
│   ├── HomeView.vue        # Public landing page
│   └── ProtectedView.vue   # Protected route with group info
├── router/                 # Vue Router configuration
│   └── index.js            # Routes and auth guards
├── assets/                 # Static assets
│   └── vue.svg             # Vue logo
├── auth.js                 # Okta authentication configuration
├── App.vue                 # Root component
├── style.css               # Global styles
└── main.js                 # Application entry point

## Authentication Flow

1. User clicks "Login" button
2. Login dialog appears with username/password form
3. Credentials are validated through Okta
4. Upon successful authentication:
   - User's groups are fetched
   - Token is stored in session storage
   - Protected routes become accessible

## Group-Based Authorization

The application supports group-based access control:
- Groups are fetched during authentication
- Protected routes can require specific group membership
- Group information is displayed in the protected view

## Development

### Adding Protected Routes

Add new protected routes in `router/index.js`:

```javascript
{
  path: '/protected-route',
  component: ProtectedComponent,
  meta: {
    requiresAuth: true,
    requiredGroups: ['AdminGroup'] // Optional: specify required groups
  }
}
```

### Customizing the Login Dialog

The login dialog component (`LoginDialog.vue`) can be customized to match your application's design system.

## Contributing

If you have any suggestions or find any bugs, please [open an issue](https://github.com/jerichoBob/vue3-okta-windsurf-test/issues). Can promise a quick turnaround, but would love your feedback.

## License

Made available under the [MIT License](https://github.com/jerichoBob/vue3-okta-windsurf-test/blob/main/LICENSE). Hopefully this will be useful for you too!
