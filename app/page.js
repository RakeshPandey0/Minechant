"use client";

import Title from "./_components/Title/page";
import ItemContainer from "./_components/ItemContainer/page";
import EnchantmentContainer from "./_components/EnchantmentContainer/page";
import { Provider } from "react-redux";
import store from "./redux/store";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="flex flex-col items-center justify-center gap-4 bg-[#305c4c] min-h-screen">
        <Title />
        <ItemContainer />
        <EnchantmentContainer />
      </div>
    </Provider>
  );
}
