import ModuleCard from './ModuleCard';
import FlashcardBundle from './FlashcardBundle';

// Updated sample data with only title and img
const cardSets = [
    { title: 'Generic Notes 1', image: '/teacherpink.jpg' },
    { title: 'Generic Notes 2', image: '/studentpink.jpg' },
    { title: 'Generic Notes 3', image: '/tapink.jpg' },
    { title: 'Midterm Study Set', image: '/studentpink.jpg' },
    { title: 'Lecture Notes A', image: '/teacherpink.jpg' },
    { title: 'Assignment Review', image: '/tapink.jpg' },
];

export default function ModuleGrid() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center p-6">
            {cardSets.map((card) => (
                <FlashcardBundle key={card.title} {...card} />
            ))}
        </section>
    );
}
