"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SearchInput } from "./SearchInput";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const AuthComponent = () => {
    if (isLoading) return null;

    return isAuthenticated ? (
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                toast.success("Logged out successfully");
                router.push("/");
              },
              onError: (error) => {
                toast.error(error.error.message);
              },
            },
          })
        }
      >
        Logout
      </Button>
    ) : (
      <>
        <Link className={buttonVariants()} href="/auth/sign-up">
          Sign up
        </Link>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="/auth/login"
        >
          Login
        </Link>
      </>
    );
  };

  return (
    <nav className="w-full py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next<span className="text-primary">Pro</span>
          </h1>
        </Link>

        {/* Theme toggle visible on mobile */}
        <div className="md:hidden gap-2 flex items-center">
          <AuthComponent />
          <ThemeToggle />
        </div>
      </div>

      {/* NAV LINKS */}
      <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
        <Link className={buttonVariants({ variant: "ghost" })} href="/">
          Home
        </Link>
        <Link className={buttonVariants({ variant: "ghost" })} href="/blog">
          Blog
        </Link>
        <Link className={buttonVariants({ variant: "ghost" })} href="/create">
          Create
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
        <div className="hidden md:block mr-2">
          <SearchInput />
        </div>

        {/* Theme toggle for desktop */}
        <div className="hidden md:flex items-center gap-2">
          <AuthComponent />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
