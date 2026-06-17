import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Authentication Error</h1>
        <p className="text-sm text-muted-foreground">
          Something went wrong during sign-in. Please try again.
        </p>
        <Link href="/auth/login" className="text-sm underline underline-offset-4">
          Back to login
        </Link>
      </div>
    </div>
  );
}
