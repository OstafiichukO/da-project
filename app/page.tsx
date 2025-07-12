import Link from "next/link";

export default function Page() {
    return (
        <div className="container mx-auto pt-[40px] w-full mt-6 flex">
            <div className="w-full flex flex-col justify-center items-center py-16 px-4">
                {/* Hero Section */}
                <div className="mb-10 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 text-center mb-4 font-serif drop-shadow-sm">
                        Preserve Your Family’s Story
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 text-center max-w-2xl mb-6 font-sans">
                        A digital album for memories, culture, and heritage.
                        Collect, organize, and share your family’s photos,
                        stories, and traditions. Build a living archive for
                        future generations.
                    </p>
                    <blockquote className="italic text-stone-700 text-center max-w-xl mb-8 font-serif">
                        “In every conceivable manner, the family is link to our
                        past, bridge to our future.”
                        <br />
                        <span className="block text-sm text-stone-500 mt-2">
                            — Alex Haley
                        </span>
                    </blockquote>
                    <Link
                        href="/gallery"
                        className="inline-block bg-[var(--color-yellow)] text-[var(--color-blue)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-all mb-2"
                    >
                        Start Your Family Album
                    </Link>
                    <p className="text-gray-500 text-sm mt-2">
                        Your memories are safe, private, and always accessible.
                    </p>
                </div>
                {/* Why Digital Heritage Section */}
                <div className="mt-12 max-w-3xl w-full bg-white bg-opacity-90 rounded-xl shadow p-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-stone-700 mb-4 font-serif">
                        Why Digital Heritage?
                    </h2>
                    <ul className="text-gray-700 text-lg space-y-2 list-disc list-inside">
                        <li>
                            Preserve precious memories for future generations
                        </li>
                        <li>
                            Share stories, photos, and traditions with family
                            worldwide
                        </li>
                        <li>
                            Organize your family’s history in one safe place
                        </li>
                        <li>Celebrate your unique cultural heritage</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
