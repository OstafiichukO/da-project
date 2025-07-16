import "../i18n";
import { useTranslation } from "react-i18next";

export default function LoadingAlbums() {
    const { t } = useTranslation("common");
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
                <span className="block w-16 h-16 border-4 border-blue-400 border-t-transparent border-b-transparent rounded-full animate-spin"></span>
                <span className="absolute top-0 left-0 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 opacity-20"></span>
            </div>
            <span className="mt-6 text-xl font-semibold text-blue-600 tracking-wide">
                {t("loadingAlbums")}
            </span>
        </div>
    );
}
