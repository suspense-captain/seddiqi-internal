import React from "react";
import ReactMarkdown from "react-markdown";
import { getImageURL } from "@utils/cms/helpers/getImageUrl";
import Typography from "../typography";
import Link from "next/link";
import { CmsContent } from "@utils/cms/utils";
import ContentBlock from "../contentBlock";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { marked } from "marked";
import classNames from "classnames";

type TextProps = {} & CmsContent;

// 👉 Helper: Convert markdown-style links inside HTML tags to real anchor tags
const convertMarkdownInHTML = (input: string): string => {
  const tagRegex = /<([a-z]+)([^>]*)>(.*?)<\/\1>/gis;

  return input.replace(tagRegex, (match, tag, attrs, inner) => {
    // Parse inner content (Markdown) to HTML
    const parsedInner = marked.parseInline(inner.trim());
    return `<${tag}${attrs}>${parsedInner}</${tag}>`;
  });
};

const RichText = ({ text = [], align = "left", className }: TextProps) => {
  const components = {
    h1: ({ node, ...props }) => <Typography variant="h1" {...props} />,
    h2: ({ node, ...props }) => <Typography variant="h2" {...props} />,
    h3: ({ node, ...props }) => <Typography variant="h3" {...props} />,
    h4: ({ node, ...props }) => <Typography variant="h4" {...props} />,
    h5: ({ node, ...props }) => <Typography variant="h5" {...props} />,
    h6: ({ node, ...props }) => <Typography variant="h6" {...props} />,
    // Let <a> in raw HTML render as-is
    a: ({ href, children }) => <Link href={href || "#"}>{children}</Link>,
    li: ({ node, ...props }) => (
      <li>
        <Typography variant="p" component="span" align={align} {...props} />
      </li>
    ),
  };

  const renderMarkdown = (markdownText: string, key?: number, className?: string) => (
    <div key={key} style={{ textAlign: align }} className={`${className}`}>
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeRaw]} // allows raw HTML like <p style=...>
        remarkPlugins={[remarkGfm]} // supports [link](url) and tables etc.
      >
        {convertMarkdownInHTML(markdownText)}
      </ReactMarkdown>
    </div>
  );

  // Handle string text
  if (typeof text === "string") {
    return renderMarkdown(text, align + className, className);
  }

  // Handle CMS array content
  return (
    <>
      {text.map((item: any, index: number) => {
        const { type, data } = item;

        switch (type) {
          case "markdown":
            return data ? renderMarkdown(data, index, `${className} amp-dc-text`) : null;

          case "dc-content-link":
            return data && <ContentBlock key={index} content={data} />;

          case "dc-image-link":
            return (
              data && (
                <picture key={data.name || index} className="amp-dc-image">
                  <img
                    src={getImageURL(data, { strip: true })}
                    className="amp-dc-image-pic"
                    width="100%"
                    alt={data.name}
                  />
                </picture>
              )
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default RichText;
