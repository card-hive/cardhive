import FlashcardBundle from './FlashcardBundle';

// Updated sample data with only title and img
// const cardSets = [
//     { title: 'Generic Notes 1', image: '/teacherpink.jpg' },
//     { title: 'Generic Notes 2', image: '/studentpink.jpg' },
//     { title: 'Generic Notes 3', image: '/tapink.jpg' },
//     { title: 'Midterm Study Set', image: '/studentpink.jpg' },
//     { title: 'Lecture Notes A', image: '/teacherpink.jpg' },
//     { title: 'Assignment Review', image: '/tapink.jpg' },
// ];

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
