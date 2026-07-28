import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <SignIn
        appearance={{
          elements: {
            cardBox: "shadow-[0_24px_70px_rgba(0,0,0,0.38)]",
          },
        }}
      />
    </div>
  );
}
