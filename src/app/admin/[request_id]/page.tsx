import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { PostgrestError } from '@supabase/supabase-js';

export default async function RequestDetailsPage({
    params,
}: {
    params: Promise<{ request_id: string }>;
}) {
    const supabase = await createClient();

    type RequestRow = {
        request_id: string;
        request_type: string;
        description: string;
        account_id: string;
        image_links: string[];
        status: string;
        accounts: { name: string | null } | null;
    };

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) redirect('/login');

    const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('account_type')
        .eq('account_id', user.id)
        .single();

    if (accountError || !account || account.account_type !== 'Admin') {
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Request Details</h1>
                <p className="text-red-600">
                    Not authorized to view this page.
                </p>
            </div>
        );
    }

    const paramsResolved = await params;
    const requestId = paramsResolved.request_id;

    const { data: request, error: requestError } = (await supabase
        .from('requests')
        .select(
            'request_id, request_type, status, description, image_links, accounts(name), account_id',
        )
        .eq('request_id', requestId)
        .single()) as unknown as {
        data: RequestRow;
        error: PostgrestError | null;
    };

    if (requestError || !request) {
        return notFound();
    }

    const signedImages = await Promise.all(
        request.image_links.map(async (path: string) => {
            const { data } = await supabase.storage
                .from('request-images')
                .createSignedUrl(path, 300);
            return data?.signedUrl;
        }),
    );

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Request Details</h1>

            <div className="space-y-4">
                <div>
                    <p className="text-gray-600 text-sm">User Name</p>
                    <p className="text-lg font-medium">
                        {request.accounts?.name || '-'}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">Request Type</p>
                    <p className="text-lg font-medium">
                        {request.request_type}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-lg font-medium">
                        {request.status || '-'}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">Description</p>
                    <p className="text-lg">{request.description}</p>
                </div>

                {request.image_links && request.image_links.length > 0 && (
                    <div>
                        <p className="text-gray-600 text-sm mb-2">
                            Attached Images
                        </p>
                        <div className="flex flex-col gap-4">
                            {signedImages.map((url, idx) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Request image ${idx + 1}`}
                                    className="w-full object-contain rounded"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {request.status === 'Pending' && (
                <div className="mt-8">
                    {request.request_type === 'upgrade' ? (
                        <div className="flex gap-4">
                            <form
                                action={`/admin/${request.request_id}/approve`}
                                method="POST"
                            >
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                                >
                                    Approve
                                </button>
                            </form>
                            <form
                                action={`/admin/${request.request_id}/reject`}
                                method="POST"
                            >
                                <button
                                    type="submit"
                                    className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </form>
                        </div>
                    ) : (
                        <form
                            action={`/admin/${request.request_id}/resolve`}
                            method="POST"
                        >
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                            >
                                Mark as Resolved
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
