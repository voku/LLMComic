export const generatedImages = {
  'main-intro-bg': 'generated/main-intro-bg.svg',
  // Uploaded comic-style PNG pages (story told through images)
  'comic-page-1': 'generated/1773597875498.png',
  'comic-page-2': 'generated/1773597878808.png',
  'comic-page-3': 'generated/1773597883925.png',
  'comic-page-4': 'generated/1773597887326.png',
  'comic-page-5': 'generated/1773597890190.png',
  'comic-page-6': 'generated/1773597896129.png',
  'comic-page-7': 'generated/1773597896891.png',
  'comic-page-8': 'generated/1773597898900.png',
  intro: 'generated/intro.svg',
  symptoms: 'generated/symptoms.svg',
  'new-engineer': 'generated/new-engineer.svg',
  'the-tools': 'generated/the-tools.svg',
  'cheap-part': 'generated/cheap-part.svg',
  'the-catch': 'generated/the-catch.svg',
  'first-clue': 'generated/first-clue.svg',
  'first-clue-bg': 'generated/first-clue-bg.svg',
  workflow: 'generated/workflow.svg',
  'pattern-mirrors': 'generated/pattern-mirrors.svg',
  'happy-path': 'generated/happy-path.svg',
  'eighty-eighty': 'generated/eighty-eighty.svg',
  'slow-decay': 'generated/slow-decay.svg',
  'missing-knowledge': 'generated/missing-knowledge.svg',
  'missing-knowledge-bg': 'generated/missing-knowledge-bg.svg',
  'quiet-witness': 'generated/quiet-witness.svg',
  'quiet-witness-bg': 'generated/quiet-witness-bg.svg',
  'danny-kruger-effect': 'generated/danny-kruger-effect.svg',
  'danny-kruger-effect-bg': 'generated/danny-kruger-effect-bg.svg',
  'reality-arrives': 'generated/reality-arrives.svg',
  'real-shift': 'generated/real-shift.svg',
  'closing-case': 'generated/closing-case.svg',
} as const;

export type GeneratedImageId = keyof typeof generatedImages;

export function hasGeneratedImage(imageId: string): imageId is GeneratedImageId {
  return imageId in generatedImages;
}

export function getGeneratedImagePath(imageId: string, basePath = '/'): string | null {
  if (!hasGeneratedImage(imageId)) {
    return null;
  }

  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
  return `${normalizedBasePath}${generatedImages[imageId]}`;
}
