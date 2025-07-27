'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FlashcardBundleProps {
    title: string;
    description: string;
    image: string;
    cardset_id: string;
    verifiers: { name: string; account_type: 'Student' | 'TA' | 'Professor' }[];
}

export default function FlashcardBundle({
    title,
    description,
    image,
    cardset_id,
    verifiers = [],
}: FlashcardBundleProps) {
    const [showVerifierList, setShowVerifierList] = useState(false);

    const highestRole = verifiers.some((v) => v.account_type === 'Professor')
        ? 'Professor'
        : verifiers.some((v) => v.account_type === 'TA')
          ? 'TA'
          : verifiers.length > 0
            ? 'Student'
            : 'None';

    let bgColor = 'bg-violet-300';
    if (highestRole === 'TA') bgColor = 'bg-green-400';
    if (highestRole === 'Professor') bgColor = 'bg-green-600';

    const truncatedDescription = description
        ? description.length > 40
            ? description.slice(0, 40) + '…'
            : description
        : '';

    return (
        <div
            className={`relative rounded-2xl shadow-md overflow-visible w-full flex flex-col items-center transition-transform hover:scale-105`}
        >
            <Link href={`/cardview/${cardset_id}`} className="w-full">
                <div className="relative w-full h-28 rounded-t-2xl overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="100vw"
                    />
                </div>
            </Link>

            <div
                className={`${bgColor} w-full flex flex-col items-center rounded-b-2xl`}
            >
                <div className="text-black text-center font-semibold py-1 w-full">
                    {title}
                </div>

                {description ? (
                    <div className="px-2 pb-1 text-xs text-gray-800 text-center w-full">
                        {truncatedDescription}
                    </div>
                ) : (
                    <div className="px-2 pb-1 text-xs text-gray-800 text-center w-full">
                        <br></br>
                    </div>
                )}

                <div
                    className="relative w-full text-center text-xs p-1 cursor-pointer hover:underline"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowVerifierList((prev) => !prev);
                    }}
                >
                    {verifiers.length > 0
                        ? `Verified by: ${highestRole}`
                        : 'Not verified'}

                    {showVerifierList && verifiers.length > 0 && (
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded shadow-lg p-2 text-xs z-50">
                            {verifiers.map((v, idx) => (
                                <div key={idx} className="text-gray-800">
                                    {v.name} — {v.account_type}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
