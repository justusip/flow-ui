"use client";

import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";

const NoSSR = (props: React.PropsWithChildren): React.ReactNode => {
    // const [isMounted, setIsMounted] = useState(false);
    //
    // useEffect(() => {
    //     setIsMounted(true);
    // }, []);
    //
    // if (!isMounted)
    //     return <></>;
    //
    // return <>{props.children}</>;
    return props.children;
};

export default dynamic(() => Promise.resolve(NoSSR), {
    ssr: false,
});