// Shared with generateStaticParams/generateMetadata in app/project/[slug]/page.tsx
// and the project title so both always agree on the same URL.
export function slugifyProjectTitle(title: string) {
  return title.split('—')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
}
