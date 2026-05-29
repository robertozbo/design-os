/**
 * Fisio section loader — mirrors personal-section-loader.ts but for fisio namespace.
 *
 * Paths:
 * - product-fisio/sections/[id]/spec.md
 * - product-fisio/sections/[id]/data.json
 * - src/sections-fisio/[id]/[Page].tsx
 * - product-fisio/sections/[id]/*.png
 */

import type { SectionData, ScreenDesignInfo, ScreenshotInfo } from '@/types/section'
import type { ComponentType } from 'react'
import { parseSpec } from './section-loader'

const specFiles = import.meta.glob('/product-fisio/sections/*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const dataFiles = import.meta.glob('/product-fisio/sections/*/data.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

const screenDesignModules = import.meta.glob('/src/sections-fisio/*/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

const screenshotFiles = import.meta.glob('/product-fisio/sections/*/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

function extractSectionIdFromProduct(path: string): string | null {
  const match = path.match(/\/product-fisio\/sections\/([^/]+)\//)
  return match?.[1] || null
}

function extractSectionIdFromSrc(path: string): string | null {
  const match = path.match(/\/src\/sections-fisio\/([^/]+)\//)
  return match?.[1] || null
}

function extractScreenDesignName(path: string): string | null {
  const match = path.match(/\/src\/sections-fisio\/[^/]+\/([^/]+)\.tsx$/)
  return match?.[1] || null
}

function extractScreenshotName(path: string): string | null {
  const match = path.match(/\/product-fisio\/sections\/[^/]+\/([^/]+)\.png$/)
  return match?.[1] || null
}

export function getFisioSectionScreenDesigns(sectionId: string): ScreenDesignInfo[] {
  const screenDesigns: ScreenDesignInfo[] = []
  const prefix = `/src/sections-fisio/${sectionId}/`

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

export function getFisioSectionScreenshots(sectionId: string): ScreenshotInfo[] {
  const screenshots: ScreenshotInfo[] = []
  const prefix = `/product-fisio/sections/${sectionId}/`

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

export function loadFisioScreenDesignComponent(
  sectionId: string,
  screenDesignName: string,
): (() => Promise<{ default: ComponentType }>) | null {
  const path = `/src/sections-fisio/${sectionId}/${screenDesignName}.tsx`
  return screenDesignModules[path] || null
}

export function loadFisioSectionData(sectionId: string): SectionData {
  const specPath = `/product-fisio/sections/${sectionId}/spec.md`
  const dataPath = `/product-fisio/sections/${sectionId}/data.json`

  const specContent = specFiles[specPath] || null
  const dataModule = dataFiles[dataPath]
  const data = dataModule?.default || null

  return {
    sectionId,
    spec: specContent,
    specParsed: specContent ? parseSpec(specContent) : null,
    data,
    screenDesigns: getFisioSectionScreenDesigns(sectionId),
    screenshots: getFisioSectionScreenshots(sectionId),
  }
}

export function hasFisioSectionSpec(sectionId: string): boolean {
  return `/product-fisio/sections/${sectionId}/spec.md` in specFiles
}

export function hasFisioSectionData(sectionId: string): boolean {
  return `/product-fisio/sections/${sectionId}/data.json` in dataFiles
}

export function getAllFisioSectionIds(): string[] {
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
