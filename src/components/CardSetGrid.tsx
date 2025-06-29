import FlashcardBundle from './FlashcardBundle';

type CardSet = {
    id: string;
    title: string;
    image: string;
};

type CardSetGridProps = {
    cardsets: CardSet[];
};

export default function CardSetGrid({ cardsets }: CardSetGridProps) {
    return (
        <section className="grid grid-cols-3 gap-6 justify-items-center">
            {cardsets.map((cardset, index) => (
                <FlashcardBundle
                    key={index}
                    cardset_id={cardset.id}
                    {...cardset}
                />
            ))}
        </section>
    );
}
