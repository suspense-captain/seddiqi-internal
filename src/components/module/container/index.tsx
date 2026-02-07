import React from 'react';
import { CmsContent } from '@utils/cms/utils';
import ContentBlock from '@components/module/contentBlock';

interface ContainerProps {
    contentTypes: CmsContent[];
}

const Container = ({ contentTypes = [] }: ContainerProps) => {
    return (
        <div>
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

export default Container;