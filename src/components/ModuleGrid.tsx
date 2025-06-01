import ModuleCard from './ModuleCard';

//sample data
const modules = [
    { code: 'LAJ1201', image: '/japan.jpg' },
    { code: 'CS1101S', image: '/matrix.jpg' },
    { code: 'MA1521', image: '/math.jpeg' },
    { code: 'LAJ2201', image: '/japan.jpg' },
    { code: 'CS2040S', image: '/matrix.jpg' },
    { code: 'MA1522', image: '/math.jpeg' },
];

export default function ModuleGrid() {
    return (
        <section className="grid grid-cols-3 gap-6 justify-items-center">
            {modules.map((mod) => (
                <ModuleCard key={mod.code} {...mod} />
            ))}
        </section>
    );
}
