import Image from 'next/image';
import Link from 'next/link';

interface ModuleCardProps {
    code: string;
    image: string;
    add_cardset?: boolean;
}

export default function ModuleCard({
    code,
    image,
    add_cardset,
}: ModuleCardProps) {
    return (
        <Link
            href={add_cardset ? `/new/${code}` : `/modules/${code}`}
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
        </Link>
    );
}
