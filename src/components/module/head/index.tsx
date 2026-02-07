import React from 'react';
import NextHead from 'next/head';
import FontPreloader from '../fontPreloader';
// import { DefaultSeo } from 'next-seo';

const Head = () => {

    return (
        <>
            {/* <DefaultSeo /> */}
            <NextHead>
                <meta charSet="utf8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <meta name="aria_config_locator_hub" content={""} />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <title>Ahmed Seddiqi</title>
                <FontPreloader />
            </NextHead>
        </>
    );
};

export default Head;