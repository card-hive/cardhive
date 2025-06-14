'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ModuleCardProps {
    code: string;
    image: string;
}

export default function ModuleCard({ code, image }: ModuleCardProps) {
    const router = useRouter();

    function reRoute(route: string) {
        router.push('/modules/cardsets/' + route);
    }
    return (
        <div
            onClick={() => reRoute(code)}
            className="bg-white rounded-2xl shadow-md overflow-hidden w-full flex flex-col items-center"
        >
            <div className="relative w-full h-32">
                <Image
                    src={image}
                    alt={code}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="100vw"
                />
            </div>
            <div className="bg-violet-300 text-black text-center font-semibold py-2 w-full">
                {code}
            </div>
        </div>
    );
}
