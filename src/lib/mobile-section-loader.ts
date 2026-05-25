/**
 * Mobile section loader — mirrors section-loader.ts but for mobile namespace.
 *
 * Paths:
 * - product-mobile/sections/[id]/spec.md
 * - product-mobile/sections/[id]/data.json
 * - src/sections-mobile/[id]/[Page].tsx
 * - product-mobile/sections/[id]/*.png
 */

import type { SectionData, ScreenDesignInfo, ScreenshotInfo } from '@/types/section'
import type { ComponentType } from 'react'
import { parseSpec } from './section-loader'

const specFiles = import.meta.glob('/product-mobile/sections/*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const dataFiles = import.meta.glob('/product-mobile/sections/*/data.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

const screenDesignModules = import.meta.glob('/src/sections-mobile/*/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

const screenshotFiles = import.meta.glob('/product-mobile/sections/*/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

function extractSectionIdFromProduct(path: string): string | null {
  const match = path.match(/\/product-mobile\/sections\/([^/]+)\//)
  return match?.[1] || null
}

function extractSectionIdFromSrc(path: string): string | null {
  const match = path.match(/\/src\/sections-mobile\/([^/]+)\//)
  return match?.[1] || null
}

function extractScreenDesignName(path: string): string | null {
  const match = path.match(/\/src\/sections-mobile\/[^/]+\/([^/]+)\.tsx$/)
  return match?.[1] || null
}

function extractScreenshotName(path: string): string | null {
  const match = path.match(/\/product-mobile\/sections\/[^/]+\/([^/]+)\.png$/)
  return match?.[1] || null
}

export function getMobileSectionScreenDesigns(sectionId: string): ScreenDesignInfo[] {
  const screenDesigns: ScreenDesignInfo[] = []
  const prefix = `/src/sections-mobile/${sectionId}/`

  for (const path of Object.keys(screenDesignModules)) {
    if (path.startsWith(prefix)) {
      const name = extractScreenDesignName(path)
      if (name) {
        screenDesigns.push({ name, path, componentName: name })
      }
    }
  }

  return screenDesigns
}

export function getMobileSectionScreenshots(sectionId: string): ScreenshotInfo[] {
  const screenshots: ScreenshotInfo[] = []
  const prefix = `/product-mobile/sections/${sectionId}/`

  for (const [path, url] of Object.entries(screenshotFiles)) {
    if (path.startsWith(prefix)) {
      const name = extractScreenshotName(path)
      if (name) {
        screenshots.push({ name, path, url })
      }
    }
  }

  return screenshots
}

export function loadMobileScreenDesignComponent(
  sectionId: string,
  screenDesignName: string,
): (() => Promise<{ default: ComponentType }>) | null {
  const path = `/src/sections-mobile/${sectionId}/${screenDesignName}.tsx`
  return screenDesignModules[path] || null
}

export function loadMobileSectionData(sectionId: string): SectionData {
  const specPath = `/product-mobile/sections/${sectionId}/spec.md`
  const dataPath = `/product-mobile/sections/${sectionId}/data.json`

  const specContent = specFiles[specPath] || null
  const dataModule = dataFiles[dataPath]
  const data = dataModule?.default || null

  return {
    sectionId,
    spec: specContent,
    specParsed: specContent ? parseSpec(specContent) : null,
    data,
    screenDesigns: getMobileSectionScreenDesigns(sectionId),
    screenshots: getMobileSectionScreenshots(sectionId),
  }
}

export function hasMobileSectionSpec(sectionId: string): boolean {
  return `/product-mobile/sections/${sectionId}/spec.md` in specFiles
}

export function hasMobileSectionData(sectionId: string): boolean {
  return `/product-mobile/sections/${sectionId}/data.json` in dataFiles
}

export function getAllMobileSectionIds(): string[] {
  const ids = new Set<string>()

  for (const path of Object.keys(specFiles)) {
    const id = extractSectionIdFromProduct(path)
    if (id) ids.add(id)
  }

  for (const path of Object.keys(dataFiles)) {
    const id = extractSectionIdFromProduct(path)
    if (id) ids.add(id)
  }

  for (const path of Object.keys(screenDesignModules)) {
    const id = extractSectionIdFromSrc(path)
    if (id) ids.add(id)
  }

  return Array.from(ids).sort()
}
