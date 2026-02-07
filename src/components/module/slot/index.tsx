import React from 'react';
import { CmsContent } from '@utils/cms/utils';
import ContentBlock from '@components/module/contentBlock';

type SlotProps = {} & CmsContent;

const Slot = ({ content }: SlotProps) => {
    return <ContentBlock content={content} />;
};

export default Slot;