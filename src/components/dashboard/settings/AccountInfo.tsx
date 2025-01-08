import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AccountInfoProps {
  email: string | null;
}

export function AccountInfo({ email }: AccountInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Your basic account details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Email Address</Label>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </CardContent>
    </Card>
  );
}