"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Loader from "../loader";

export function SignInForm({
  className,
  ...props
}: {
  className?: string;
} & React.ComponentProps<"div">) {
  const { isPending } = authClient.useSession();

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription>Login with your Notion account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() =>
              authClient.signIn.social({
                provider: "notion",
                callbackURL: `${process.env.NEXT_PUBLIC_WEB_URL}/chat`,
              })
            }
          >
            Continue with Notion
          </Button>
        </CardContent>
      </Card>
      <div className='text-center text-xs text-balance text-muted-foreground'>
        By clicking continue, you agree to our{" "}
        <a href='#' className='underline underline-offset-4 hover:text-primary'>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href='#' className='underline underline-offset-4 hover:text-primary'>
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
