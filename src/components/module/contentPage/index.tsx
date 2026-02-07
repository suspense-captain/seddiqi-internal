import React from 'react';
import { CmsContent } from '@utils/cms/utils';
import ContentBlock from '@components/module/contentBlock';
import Typography from '../typography';

interface ContentPageProps {
    contentTypes: CmsContent[];
    seo: any;
}

const ContentPage = ({ contentTypes = [], seo = {} }: ContentPageProps) => {
    return (
        <div>
            <Typography variant="h1" align={'center'} >
                {seo.title}
            </Typography>
            <Typography variant="p" align={'center'}>
                {seo.description}
            </Typography>
            {contentTypes.map((item, index: number) => {
                return (
                    <div key={index}>
                        <ContentBlock content={item} />
                    </div>
                );
            })}
        </div>
    );
};

export default ContentPage;