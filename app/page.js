import Title from "./_components/Title/page";
import ItemContainer from "./_components/ItemContainer/page";
import EnchantmentContainer from "./_components/EnchantmentContainer/page";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 bg-[#292524] min-h-screen">
            <Title />
            <ItemContainer title={"Select an Item to Enchant"} />
            <EnchantmentContainer title={"Select Books for Enchantment"} />
        </div>
    );
}
