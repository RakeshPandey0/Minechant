import Title from "./_components/Title/page";
import Container from "./_components/Container/page";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 bg-[#292524] min-h-screen">
            <Title />
            <Container />
        </div>
    );
}
