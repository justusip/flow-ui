"use client";

import dynamic from "next/dynamic";

export default function Page() {
    // const App = dynamic(
    //     () => import("@/app/app"),
    //     {ssr: false}
    // );
    // return <App/>;
    return <div className={"text-white p-4"}>hi</div>;
};