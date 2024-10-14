// https://github.com/strapi/blocks-react-renderer
import React, { type JSX } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
/// typetype BlocksContent

export function renderContent(content): JSX.Element {
  return (<BlocksRenderer content={[...content]} />);
}
