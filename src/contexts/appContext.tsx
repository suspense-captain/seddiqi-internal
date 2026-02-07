import React, { PropsWithChildren, useEffect, useState } from 'react';
import { getConfig } from '@utils/cms/config';

const Context = React.createContext<any | null>(null);

export function useAppContext(): any {
    return React.useContext(Context) as any;
}

interface WithLazyAppContextProps extends PropsWithChildren {}

export const WithLazyAppContext = (props: WithLazyAppContextProps) => {
    const { children } = props;

    const [context, setContext] = useState<any | null>(null);
    useEffect(() => {
        createAppContext().then(setContext);
    }, []);

    return context ? <Context.Provider value={context}>{children}</Context.Provider> : <div>loading...</div>;
};

interface WithAppContextProps extends PropsWithChildren {
    value: any;
}

export const WithAppContext = ({ children, value }: WithAppContextProps) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export async function createAppContext(): Promise<any> {
    let context: any = getConfig();

    // support older style config objects
    if (typeof context.hubName === 'string') {
        context.cms = {
            hubName: context.hubName,
        };
    }

    return context;
}
