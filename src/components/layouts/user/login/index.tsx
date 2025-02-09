"use client";
import { useActionState, useState } from "react";
import { login } from "@/app/actions/authAction";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Login = () => {
  const initialState = {
    errors: {
      email: undefined,
      password: undefined,
    },
    message: "",
  };
  const [state, dispatch] = useActionState(login, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <CardHeader>
        <CardTitle className="text-2xl text-center p-2">Login</CardTitle>
        <CardDescription className="text-center p-2">
          Enter your email and password to access your account.
        </CardDescription>
      </CardHeader>
      <form action={dispatch}>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
              className="border border-gray-300 p-2 rounded-md hover:shadow-lg transition-all duration-200 ease-in-out"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
              className="border border-gray-300 p-2 rounded-md hover:shadow-lg transition-all duration-200 ease-in-out"
            />
          </div>
          {state.message && (
            // aria-live="polite" は、動的に変化する要素をスクリーンリーダーに読み上げさせるための属性
            // これにより、エラーメッセージが表示されたときにスクリーンリーダーが読み上げる
            <p className="text-red-600 text-sm text-center" aria-live="polite">
              {state.message}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-4 flex flex-col space-y-2">
          <Button className="w-full bg-gray-600 text-white p-2 rounded-md hover:bg-gray-900 transition-all duration-200 ease-in-out">
            Sign in
          </Button>
          {/* <Button className="w-full bg-gray-200 text-black p-2 rounded-md hover:bg-gray-300 transition-all duration-200 ease-in-out">
            Forgot Password
          </Button> */}
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
