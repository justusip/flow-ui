import React, {useEffect, useState} from "react";

const NoSSR = (props: React.PropsWithChildren) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    if (!isMounted)
        return <></>;
    return props.children;
};

export default NoSSR;