/**
 * Clinic section loader — mirrors section-loader.ts but for clinica namespace.
 *
 * Paths:
 * - product-clinic/sections/[id]/spec.md
 * - product-clinic/sections/[id]/data.json
 * - src/sections-clinic/[id]/[Page].tsx
 * - product-clinic/sections/[id]/*.png
 */

import type { SectionData, ScreenDesignInfo, ScreenshotInfo } from '@/types/section'
import type { ComponentType } from 'react'
import { parseSpec } from './section-loader'

const specFiles = import.meta.glob('/product-clinic/sections/*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const dataFiles = import.meta.glob('/product-clinic/sections/*/data.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

const screenDesignModules = import.meta.glob('/src/sections-clinic/*/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

const screenshotFiles = import.meta.glob('/product-clinic/sections/*/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

function extractSectionIdFromProduct(path: string): string | null {
  const match = path.match(/\/product-clinic\/sections\/([^/]+)\//)
  return match?.[1] || null
}

function extractSectionIdFromSrc(path: string): string | null {
  const match = path.match(/\/src\/sections-clinic\/([^/]+)\//)
  return match?.[1] || null
}

function extractScreenDesignName(path: string): string | null {
  const match = path.match(/\/src\/sections-clinic\/[^/]+\/([^/]+)\.tsx$/)
  return match?.[1] || null
}

function extractScreenshotName(path: string): string | null {
  const match = path.match(/\/product-clinic\/sections\/[^/]+\/([^/]+)\.png$/)
  return match?.[1] || null
}

export function getClinicSectionScreenDesigns(sectionId: string): ScreenDesignInfo[] {
  const screenDesigns: ScreenDesignInfo[] = []
  const prefix = `/src/sections-clinic/${sectionId}/`

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

export function getClinicSectionScreenshots(sectionId: string): ScreenshotInfo[] {
  const screenshots: ScreenshotInfo[] = []
  const prefix = `/product-clinic/sections/${sectionId}/`

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

export function loadClinicScreenDesignComponent(
  sectionId: string,
  screenDesignName: string,
): (() => Promise<{ default: ComponentType }>) | null {
  const path = `/src/sections-clinic/${sectionId}/${screenDesignName}.tsx`
  return screenDesignModules[path] || null
}

export function loadClinicSectionData(sectionId: string): SectionData {
  const specPath = `/product-clinic/sections/${sectionId}/spec.md`
  const dataPath = `/product-clinic/sections/${sectionId}/data.json`

  const specContent = specFiles[specPath] || null
  const dataModule = dataFiles[dataPath]
  const data = dataModule?.default || null

  return {
    sectionId,
    spec: specContent,
    specParsed: specContent ? parseSpec(specContent) : null,
    data,
    screenDesigns: getClinicSectionScreenDesigns(sectionId),
    screenshots: getClinicSectionScreenshots(sectionId),
  }
}

export function hasClinicSectionSpec(sectionId: string): boolean {
  return `/product-clinic/sections/${sectionId}/spec.md` in specFiles
}

export function hasClinicSectionData(sectionId: string): boolean {
  return `/product-clinic/sections/${sectionId}/data.json` in dataFiles
}

export function getAllClinicSectionIds(): string[] {
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
