import Link from "next/link";
import { Form } from "app/form";
import { redirect } from "next/navigation";
import { createUser, getUser } from "app/db";
import { handleRegister } from "../auth/serverActions";
import { SubmitButton } from "app/submit-button";

export default function Register() {
    // async function register(formData: FormData) {
    //     "use server";
    //     let email = formData.get("email") as string;
    //     let name = formData.get("name") as string;
    //     let password = formData.get("password") as string;
    //     let user = await getUser(email);

    //     if (user.length > 0) {
    //         return "User alread y exists"; // TODO: Handle errors with useFormStatus
    //     } else {
    //         await createUser(email, name, password);
    //         redirect("/login");
    //     }
    // }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-light)]">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-[var(--color-blue)] px-4 py-6 pt-8 text-center sm:px-16">
                    <h3 className="text-xl font-semibold">Register</h3>
                    <p className="text-sm">
                        Create an account with your email and password
                    </p>
                </div>
                <Form showNameField action={handleRegister}>
                    <SubmitButton>Register</SubmitButton>
                    <p className="text-center text-sm">
                        {"Already have an account? "}
                        <Link
                            href="/login"
                            className="font-semibold text-[var(--color-light-blue)]"
                        >
                            Sign in
                        </Link>
                        {" instead."}
                    </p>
                </Form>
            </div>
        </div>
    );
}
