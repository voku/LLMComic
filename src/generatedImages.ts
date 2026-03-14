export const generatedImages = {
  'main-intro-bg': 'generated/main-intro-bg.jpg',
  intro: 'generated/intro.jpg',
  symptoms: 'generated/symptoms.jpg',
  'new-engineer': 'generated/new-engineer.jpg',
  'the-tools': 'generated/the-tools.jpg',
  'cheap-part': 'generated/cheap-part.jpg',
  'the-catch': 'generated/the-catch.jpg',
  'first-clue': 'generated/first-clue.jpg',
  'first-clue-bg': 'generated/first-clue-bg.jpg',
  workflow: 'generated/workflow.jpg',
  'pattern-mirrors': 'generated/pattern-mirrors.jpg',
  'happy-path': 'generated/happy-path.jpg',
  'eighty-eighty': 'generated/eighty-eighty.jpg',
  'slow-decay': 'generated/slow-decay.jpg',
  'missing-knowledge': 'generated/missing-knowledge.jpg',
  'missing-knowledge-bg': 'generated/missing-knowledge-bg.jpg',
  'quiet-witness': 'generated/quiet-witness.jpg',
  'quiet-witness-bg': 'generated/quiet-witness-bg.jpg',
  'danny-kruger-effect': 'generated/danny-kruger-effect.jpg',
  'danny-kruger-effect-bg': 'generated/danny-kruger-effect-bg.jpg',
  'reality-arrives': 'generated/reality-arrives.jpg',
  'real-shift': 'generated/real-shift.jpg',
  'closing-case': 'generated/closing-case.jpg',
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
