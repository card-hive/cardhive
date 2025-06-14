import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/modules');
    // return (
    //     <div>
    //         <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
    //             <h1>Homepage</h1>
    //         </main>
    //         <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    //     </div>
    // );
}
