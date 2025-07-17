# Custom Authentication System

This directory contains a modular custom authentication system built with AWS Amplify and React Hook Form. The system provides a consistent UI theme across all authentication pages.

## Features

- **Sign In**: User authentication with email and password
- **Sign Up**: User registration with email verification
- **Email Confirmation**: Verify email address with confirmation code
- **Forgot Password**: Request password reset via email
- **Confirm Reset Password**: Set new password with reset code
- **Sign Out**: Secure sign out functionality (handled by the main app)

## Components

### Core Components (`components.tsx`)
- `TextField`: Styled input field with validation
- `SubmitButton`: Primary action button with loading state
- `ProviderButton`: Secondary button for OAuth providers
- `ViewHeader`: Page title component
- `ViewSection`: Content section wrapper
- `LinksContainer`: Navigation links container
- `LinkButton`: Text link buttons
- `ErrorMessage`: Error display component
- `ViewContainer`: Main content container
- `Container`: Full page wrapper
- `ViewDivider`: Visual separator

### Auth Pages
- `SignInPage`: Login form
- `SignUpPage`: Registration form  
- `ConfirmEmailPage`: Email verification
- `ForgotPasswordPage`: Password reset request
- `ConfirmResetPasswordPage`: Password reset confirmation

### Router
- `CustomAuthenticator`: Main router that manages navigation between auth pages

## Usage

### Basic Setup
The authentication system is already integrated into `main.tsx`. The `CustomAuthenticator` component automatically handles routing between different auth states.

### Sign Out Functionality
Sign out is handled by the main application using the `useAuthenticator` hook from AWS Amplify UI React. The sign out button in the main app uses the `signOut` function directly.

### Navigation Flow
1. User starts at Sign In page
2. Can navigate to Sign Up, Forgot Password
3. After Sign Up, redirected to Email Confirmation
4. After Forgot Password, redirected to Reset Password Confirmation
5. All successful flows redirect back to Sign In
6. Successful Sign In loads the main app

## Styling

The authentication system uses a modern, consistent design with:
- Gradient backgrounds and buttons
- Smooth animations and hover effects
- Responsive design for mobile devices
- Form validation with clear error states
- Loading states for all async operations

The main stylesheet is `auth.css` which contains all the styling for the authentication components.

## Validation

Forms include comprehensive validation:
- Email format validation
- Password strength requirements (8+ chars, uppercase, lowercase, number, special character)
- Confirmation code format (6 digits)
- Password confirmation matching
- Required field validation

## Error Handling

Each page includes proper error handling for:
- Network errors
- AWS Amplify auth errors
- Form validation errors
- Loading states

All errors are displayed in a user-friendly format with clear messaging.
