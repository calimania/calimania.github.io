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

  return (<BlocksRenderer content={transformedContent} blocks={{
    heading: ({ children, level }) => {
      switch (level) {
        case 1:
          return <h1 className="mb-2 mt-1 dark:text-white text-4xl font-heading">{children}</h1>
        case 2:
          return <h2 className="mb-2 mt-1 dark:text-white text-3xl font-heading">{children}</h2>
        case 3:
          return <h3 className=" dark:text-white text-2xl font-heading">{children}</h3>
        case 4:
          return <h4 className=" dark:text-white text-2xl font-heading">{children}</h4>
        case 5:
          return <h5 className=" dark:text-white text-2xl font-heading">{children}</h5>
        case 6:
          return <h6 className=" dark:text-white text-2xl font-heading">{children}</h6>
        default:
          return <h2 className=" dark:text-white text-3xl font-heading">{children}</h2>
      }
    },
  }} />);
}


export default renderContent;
