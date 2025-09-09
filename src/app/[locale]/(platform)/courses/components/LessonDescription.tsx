import React from "react";
import { Course } from "@/app/types/course";
import sanitizeHtml from 'sanitize-html';

const LessonDescription = ({ courseData }: { courseData: Course }) => {
  const sanitizedContent = sanitizeHtml(courseData.description || "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1",
      "h2",
      "h3",
      "h4",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "target", "rel"],
    },
    transformTags: {
      h1: "h2",
      h2: "h3",
      h3: "h4",
      h4: "h5",
      a: (tagName, attribs) => {
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            target: "_blank",
            rel: "noopener noreferrer",
          },
        };
      },
    },
  });

  return (
    <div className="mt-2 bg-white px-2 border-primary-light border rounded-lg">
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        className="space-y-2 p-4 
         [&_h1]:text-5xl [&_h1]:font-bold [&_h1]:text-gray-950 [&_h1]:mb-2 [&_h1]:mt-3
         [&_h2]:text-4xl [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:mb-4 [&_h2]:mt-3
         [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-gray-700 [&_h3]:mb-2 [&_h3]:mt-3
         [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-gray-600 [&_h4]:mb-1 [&_h4]:mt-2
         [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:text-gray-600 [&_h5]:mb-1 [&_h5]:mt-2
         [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-2
         [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-0.5 [&_ul]:mb-2
         [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-0.5 [&_ol]:mb-2
         [&_li]:text-gray-600 [&_li]:leading-relaxed
         [&_strong]:font-semibold [&_strong]:text-gray-800
         [&_em]:italic [&_em]:text-gray-500
         [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800
         [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic
         [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono"
      />
    </div>
  );
};


export default LessonDescription;
