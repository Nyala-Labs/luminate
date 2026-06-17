import { SignInWithGoogleButton } from '@/components/SignInWithGoogleButton';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-lg border p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Use your Google account to continue
          </p>
        </div>
        <SignInWithGoogleButton />
      </div>
    </div>
  );
}
