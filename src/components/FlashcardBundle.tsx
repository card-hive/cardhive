import Link from 'next/link';
import Image from 'next/image';

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
    return (
        <Link
            href={`/cardview/${cardset_id}`}
            className="bg-white rounded-2xl shadow-md overflow-hidden w-full flex flex-col items-center"
        >
            <Image src={image} alt={title} width={200} height={150} />
            <h3>{title}</h3>
        </Link>
    );
}
