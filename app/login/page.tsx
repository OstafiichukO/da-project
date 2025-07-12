import Link from "next/link";
import { Form } from "app/form";
import { handleSignIn } from "../auth/serverActions";
import { SubmitButton } from "app/submit-button";

export default function Login() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-light)]">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-[var(--color-blue)] px-4 py-6 pt-8 text-center sm:px-16">
                    <h3 className="text-xl font-semibold">Login</h3>
                    <p className="text-sm">
                        Use your email and password to login
                    </p>
                </div>
                <Form action={handleSignIn}>
                    <SubmitButton>Login</SubmitButton>
                    <p className="text-center text-sm ">
                        {"Don't have an account? "}
                        <Link
                            href="/register"
                            className="font-semibold text-[var(--color-light-blue)]"
                        >
                            Register
                        </Link>
                        {" for free."}
                    </p>
                </Form>
            </div>
        </div>
    );
}
