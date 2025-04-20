import React, {type JSX} from 'react';
import { type ContentBlock } from '~/types.d';

interface PageContentProps {
  params: {
    page?: { Content: ContentBlock[] };
    post?: { Content: ContentBlock[] };
    album?: { content: ContentBlock[] };
    track?: { content: ContentBlock[] };
  };
}

/**
 * Component designed to render Content Blocks from Strapi
 * Stores, Pages & Articles store their .content attribute in this format
 * @param props - PageContentProps
 * @returns { JSX.Element }
 */
export default function PageContent({ params }: PageContentProps) {
  const content = params?.page?.Content || params?.post?.Content || params?.album?.content || params?.track?.content;
  const renderedImages = new Set<string>();

  if (!content?.length) {
    return null;
  }

  const renderImage = (node: ContentBlock['children'][0], key: number) => {
    if (!node.url || renderedImages.has(node.url)) {
      return null;
    }

    if (!node.children?.[0]?.text) {
      return null;
    }

    return (
      <figure key={key} className="image-container">
        <a
          href={node.url}
          target={node.url?.startsWith('/') ? '_self' : '_blank'}
          rel="noopener noreferrer"
          className="block"
          title={node.children?.[0]?.text || ''}
        >
          <div className="rounded-xl">
            <img
              src={node.url}
              alt={node.children?.[0]?.text || ''}
              className="max-w-sm"
              loading="lazy"
            />
          </div>
          {node.children?.[0]?.text && (
            <figcaption>
              { node.children[0].text}
            </figcaption>
          )}
        </a>
      </figure>
    );
  };

  const renderInline = (node: ContentBlock['children'][0], key: number) => {
    if (node.code) {
      return (
        <code key={key} className="inline-code">
          {node.text}
        </code>
      );
    }

    if (node.type === 'link') {
      const isImage = node.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

      if (isImage && renderedImages.has(node.url as string)) {
        renderedImages.add(node.url as string);
        return null;
      }

      return (
        <a
          key={key}
          href={node.url}
          target={node.url?.startsWith('/') ? '_self' : '_blank'}
          rel="noopener noreferrer"
          className="text-markket-blue hover:text-markket-pink transition-colors"
        >
          {node.children?.[0]?.text}
        </a>
      );
    }

    return <span key={key}>{node.text}</span>;
  };

  /**
   * For the content blocks that are lists, we need to render them recursively
   * @param node
   * @param key
   * @returns
   */
  const renderListItem = (node: ContentBlock['children'][0], key: number) => {
    if (node.type !== 'list-item') return null;

    return (
      <li key={key} className="list-item">
        {node.children?.map((child, i) => renderInline(child, i))}
      </li>
    );
  };

  const renderImageBlock = (imageData: any, key: number) => {
    if (!imageData?.url) return null;

    console.log('Rendering image:', imageData);
    const caption = imageData.caption || imageData.alternativeText;

    return (
      <figure key={key} className="my-8">
        <img
          src={imageData.url}
          alt={imageData.alternativeText || ''}
          className="rounded-lg w-full max-w-3xl mx-auto"
          width={imageData.width}
          height={imageData.height}
          loading="lazy"
        />
        {caption && (
          <figcaption className="text-center text-sm text-gray-500 mt-2">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  };

  const renderBlock = (block: ContentBlock) => {
    if (block.type === 'paragraph') {
      const imageNodes = block.children.filter(
        child => child.type === 'link' &&
          child.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) &&
          !renderedImages.has(child.url)
      );

      const textNodes = block.children.filter(
        child => !(child.type === 'link' &&
          child.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      );

      return (
        <>
          {textNodes.length > 0 && (
            <p>
              {textNodes.map((child, i) => renderInline(child, i))}
            </p>
          )}
          {imageNodes.length > 1 ? (
            <div className="image-gallery">
              {imageNodes.map((node, i) => renderImage(node, i))}
            </div>
          ) : (
            imageNodes.map((node, i) => renderImage(node, i))
          )}
        </>
      );
    }

    const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
    switch (block.type) {
      case 'heading':
        return (
          <HeadingTag key={block.level} className={`text-${block.level}xl font-bold my-4`}>
            {block.children.map((child, i) => renderInline(child, i))}
          </HeadingTag>
        );

      case 'code':
        return (
          <div className="code-block-wrapper">
            <pre className="code-block">{block.children
                .map(child => child.code ? child.text : '')
                .filter(Boolean)
                .join('\n')}</pre>
          </div>
        );

      case 'list':
        return (
          <ul className="list-container">
            {block.children
              .filter(child => child.type === 'list-item')
              .map((child, i) => renderListItem(child, i))}
          </ul>
        );

      case 'quote':
        return (
          <blockquote className="border-l-4 border-markket-blue pl-4 my-4 italic text-gray-700">
            {block.children.map((child, i) => renderInline(child, i))}
          </blockquote>
        );

      case 'image':
        return renderImageBlock(block.image, 0);

      default:
        return null;
    }
  };

  return (
    <div className='blocks-content'>
      {content.map((block: ContentBlock, index: number) => (
        <div key={index}>{renderBlock(block)}</div>
      ))}
    </div>
  );
}
