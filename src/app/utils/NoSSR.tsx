"use client";

import React, {useEffect, useState} from "react";

const NoSSR = (props: React.PropsWithChildren): React.ReactNode => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (typeof window === "undefined")
        return <></>;
    if (!isMounted)
        return <></>;

    return <>{props.children}</>;
};

export default NoSSR;