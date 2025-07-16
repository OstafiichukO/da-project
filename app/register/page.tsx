"use client";
import "../i18n";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Form } from "app/form";
import { handleRegister } from "../auth/serverActions";
import { SubmitButton } from "app/submit-button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
    const { t } = useTranslation("common");
    async function handleRegisterForm(formData: FormData) {
        try {
            const result = await handleRegister(formData);
            if (result === "User already exists") {
                toast.error(t("userExists"));
            } else {
                toast.success(t("registerSuccess"));
                router.push("/gallery");
            }
        } catch (e) {
            toast.error(t("registerFailed"));
        }
    }
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-light)]">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-[var(--color-blue)] px-4 py-6 pt-8 text-center sm:px-16">
                    <h3 className="text-xl font-semibold">{t("register")}</h3>
                    <p className="text-sm">{t("registerPrompt")}</p>
                </div>
                <Form action={handleRegisterForm} showNameField>
                    <SubmitButton>{t("register")}</SubmitButton>
                    <p className="text-center text-sm ">
                        {t("haveAccount")}{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-[var(--color-light-blue)]"
                        >
                            {t("login")}
                        </Link>
                        .
                    </p>
                </Form>
            </div>
        </div>
    );
}
