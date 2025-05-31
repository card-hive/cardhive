import Image from "next/image";

interface ModuleCardProps {
    code: string;
    image: string;
}

export default function ModuleCard({ code, image }: ModuleCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-48 h-48 flex flex-col items-center">
            <div className="relative w-full h-32">
                <Image
                    src={image}
                    alt={code}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="100vw"
                />
            </div>
            <div className="bg-purple-200 text-black text-center font-semibold py-2 w-full">
                {code}
            </div>
        </div>
    );
}
