export const loginCopy = {
  title: "Sign in",
  description: "For the PakVolt team only. There is no sign-up: the super admin adds you.",
  email: "Email",
  emailPlaceholder: "you@example.com",
  password: "Password",
  submit: "Sign in",
  twoFactor: {
    title: "Two-factor code",
    description: "Open your authenticator app and enter the 6-digit code for PakVolt Admin.",
    code: "Code",
    submit: "Verify",
    back: "Use a different account",
  },
  forgot: "Forgot your password? Ask the super admin to reset it.",
  errors: {
    email: "Enter your email address.",
    password: "Enter your password.",
    code: "Enter the 6 digits from your app.",
  },
} as const;
