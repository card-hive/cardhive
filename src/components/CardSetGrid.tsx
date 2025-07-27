import FlashcardBundle from './FlashcardBundle';

type Verifier = {
    name: string;
    account_type: 'Student' | 'TA' | 'Professor';
};

export type CardSet = {
    id: string;
    title: string;
    description: string;
    image: string;
    verifiers: Verifier[];
};

type CardSetGridProps = {
    cardsets: CardSet[];
};

export default function CardSetGrid({ cardsets }: CardSetGridProps) {
    return (
        <section className="grid grid-cols-3 gap-6 justify-items-center">
            {cardsets.map((cardset) => (
                <FlashcardBundle
                    key={cardset.id}
                    cardset_id={cardset.id}
                    title={cardset.title}
                    description={cardset.description}
                    image={cardset.image}
                    verifiers={cardset.verifiers}
                />
            ))}
        </section>
    );
}
