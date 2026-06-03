import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/20 text-lg font-bold text-primary">
            SM
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Create Account</h1>
          <p className="mt-1 text-sm text-white/60">Join SM Dream Properties</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl border-0",
            },
          }}
        />
      </div>
    </div>
  );
}
