import { resolveImageSrc } from '../lib/helpers.js'

// Renders the block array (paragraph | heading | blockquote | pullquote | image)
// inside a Tailwind `prose` container for Medium-like readability.
export default function ArticleBody({ blocks }) {
  return (
    <div className="prose prose-lg max-w-none font-lora prose-headings:font-serif prose-headings:text-ink prose-p:text-ink-secondary prose-strong:text-ink prose-a:text-accent-blue prose-blockquote:border-accent-coral prose-blockquote:not-italic prose-blockquote:text-ink prose-img:rounded-2xl">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={i}>{block.text}</h2>
          case 'blockquote':
            return <blockquote key={i}>{block.text}</blockquote>
          case 'pullquote':
            return (
              <div
                key={i}
                className="not-prose my-10 rounded-2xl border border-white/90 bg-white/80 p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)] backdrop-blur-md"
              >
                <p className="m-0 font-serif text-[1.2rem] italic leading-[1.55] text-ink">{block.text}</p>
              </div>
            )
          case 'image':
            return (
              <figure key={i} className="my-10">
                <img src={resolveImageSrc(block.url)} alt={block.caption || ''} className="w-full rounded-2xl" />
                {block.caption && (
                  <figcaption className="mt-2 text-center text-[0.8rem] text-ink-muted">{block.caption}</figcaption>
                )}
              </figure>
            )
          case 'paragraph':
          default:
            return <p key={i}>{block.text}</p>
        }
      })}
    </div>
  )
}
