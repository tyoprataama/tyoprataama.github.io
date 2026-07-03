import { resolveImageSrc } from '../lib/helpers.js'

// Renders the block array (paragraph | heading | blockquote | pullquote | image)
// inside a theme-aware Tailwind `prose` container. Tokens are CSS variables,
// and `dark:prose-invert` handles the dark theme.
export default function ArticleBody({ blocks }) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-[-0.01em] prose-headings:text-ink prose-p:text-ink-secondary prose-strong:text-ink prose-a:text-accent prose-blockquote:border-accent prose-blockquote:not-italic prose-blockquote:text-ink prose-img:rounded-lg">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={i}>{block.text}</h2>
          case 'blockquote':
            return (
              <blockquote
              key={i}
              className="not-prose relative my-9 overflow-hidden rounded-xl border border-line bg-panel py-6 pl-16 pr-7">
                <span className="absolute left-4 top-2 select-none font-serif text-[4rem] leading-none text-accent opacity-20">
                &ldquo;
                </span>
              <p className="m-0 font-serif text-[1.25rem] italic leading-[1.6] text-ink">{block.text}</p>
            </blockquote>
  )
          case 'pullquote':
            return (
            <div key={i} className="not-prose my-12 border-y border-line py-9">
      <p className="mx-auto max-w-[560px] font-serif text-[1.7rem] font-normal leading-[1.35] tracking-[-0.01em] text-ink">
        {block.text}
      </p>
      <div className="mx-auto mt-5 h-[3px] w-10 rounded-full bg-accent" />
    </div>
  )
          case 'image':
            return (
              <figure key={i} className="my-10">
                <img src={resolveImageSrc(block.url)} alt={block.caption || ''} className="w-full rounded-lg" />
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
