// https://github.com/strapi/blocks-react-renderer
import React, { type JSX } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

/**
 *
 * @param content
 * @returns
 */
function transformContent(content) {

  return content.map(block => {
    if (block.type === 'paragraph' && block.children) {

      block.children = block.children.map(child => {
        if (child.type === 'link' && child.url && child?.url?.endsWith('.png')) {

          return ({
            type: 'image',
            image: {
              url: child.url || '/image.png',
              alternativeText: child.text || 'Image',
            }
          });
        }

        return child;
      });
    }
    return block;
  });
}

/**
 *
 * @param props
 * @returns
 */
function renderContent({ post }): JSX.Element {
  const transformedContent = transformContent(post.content || []);

  return (<BlocksRenderer content={transformedContent} />);
}


export default renderContent;
