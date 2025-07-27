import Link from 'next/link';

export default async function ManageCardsetPage({
    params,
}: {
    params: Promise<{ cardset_id: string }>;
}) {
    const { cardset_id } = await params;

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Manage Card Set</h1>
            <ul className="space-y-4">
                <li>
                    <Link
                        href={`/cardview/${cardset_id}/edit/cards`}
                        className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Add/Remove/Reorder Cards
                    </Link>
                </li>

                <li>
                    <Link
                        href={`/cardview/${cardset_id}/edit/details`}
                        className="block px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                        Modify Set Details
                    </Link>
                </li>
            </ul>
        </main>
    );
}
