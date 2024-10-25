// https://github.com/strapi/blocks-react-renderer
import React, { type JSX } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

function renderContent({ post }): JSX.Element {

  return (<BlocksRenderer content={post.content || {}} />);
}


export default renderContent;
