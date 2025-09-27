import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">Account Created Successfully!</CardTitle>
          <CardDescription>Please check your email to verify your account</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            We've sent a verification email to your inbox. Please click the link in the email to activate your account
            and start using the invoice management system.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Return to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
