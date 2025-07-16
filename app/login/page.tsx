"use client";
import "../i18n";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Form } from "app/form";
import { handleSignIn } from "../auth/serverActions";
import { SubmitButton } from "app/submit-button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const { t } = useTranslation("common");
    async function handleLogin(formData: FormData) {
        try {
            await handleSignIn(formData);
            toast.success(t("loginSuccess"));
            router.push("/gallery");
        } catch (e) {
            toast.error(t("loginFailed"));
        }
    }
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-light)]">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-[var(--color-blue)] px-4 py-6 pt-8 text-center sm:px-16">
                    <h3 className="text-xl font-semibold">{t("login")}</h3>
                    <p className="text-sm">{t("loginPrompt")}</p>
                </div>
                <Form action={handleLogin}>
                    <SubmitButton>{t("login")}</SubmitButton>
                    <p className="text-center text-sm ">
                        {t("noAccount")}{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-[var(--color-light-blue)]"
                        >
                            {t("register")}
                        </Link>
                        {t("forFree")}
                    </p>
                </Form>
            </div>
        </div>
    );
}
