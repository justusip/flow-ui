"use client";

import React from "react";

const NoSSR = (props: React.PropsWithChildren): React.ReactNode => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted)
        return <></>;

    return <>{props.children}</>;
};

export default NoSSR;