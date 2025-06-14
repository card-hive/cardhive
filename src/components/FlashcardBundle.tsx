'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FlashcardBundleProps {
    title: string;
    image: string;
    cardset_id: string;
}

export default function FlashcardBundle({
    title,
    image,
    cardset_id,
}: FlashcardBundleProps) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push('/cardview/' + cardset_id)}
            className="bg-white rounded-2xl shadow-md overflow-hidden w-full flex flex-col items-center"
        >
            <div className="relative w-full h-32">
                <Image
                    src={image}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="100vw"
                />
            </div>
            <div className="bg-violet-300 text-black text-center font-semibold py-2 w-full">
                {title}
            </div>
        </div>
    );
}
