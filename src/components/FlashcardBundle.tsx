'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ModuleCardProps {
    title: string;
    image: string;
}

export default function ModuleCard({ title, image }: ModuleCardProps) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push('/cardview')}
            className="bg-white rounded-2xl shadow-md overflow-hidden w-48 h-48 flex flex-col items-center"
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
