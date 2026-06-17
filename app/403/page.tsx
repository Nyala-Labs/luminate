import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-4xl font-bold">403</h1>
        <p className="text-sm text-muted-foreground">
          You do not have permission to access this resource.
        </p>
        <Link href="/" className="text-sm underline underline-offset-4">
          Go home
        </Link>
      </div>
    </div>
  );
}
