/**
 * Clinico section loader — mirrors section-loader.ts but for clinico namespace.
 *
 * Paths:
 * - product-doctor/sections/[id]/spec.md
 * - product-doctor/sections/[id]/data.json
 * - src/sections-doctor/[id]/[Page].tsx
 * - product-doctor/sections/[id]/*.png
 */

import type { SectionData, ScreenDesignInfo, ScreenshotInfo } from '@/types/section'
import type { ComponentType } from 'react'
import { parseSpec } from './section-loader'

const specFiles = import.meta.glob('/product-doctor/sections/*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const dataFiles = import.meta.glob('/product-doctor/sections/*/data.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

const screenDesignModules = import.meta.glob('/src/sections-doctor/*/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

const screenshotFiles = import.meta.glob('/product-doctor/sections/*/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

function extractSectionIdFromProduct(path: string): string | null {
  const match = path.match(/\/product-doctor\/sections\/([^/]+)\//)
  return match?.[1] || null
}

function extractSectionIdFromSrc(path: string): string | null {
  const match = path.match(/\/src\/sections-doctor\/([^/]+)\//)
  return match?.[1] || null
}

function extractScreenDesignName(path: string): string | null {
  const match = path.match(/\/src\/sections-doctor\/[^/]+\/([^/]+)\.tsx$/)
  return match?.[1] || null
}

function extractScreenshotName(path: string): string | null {
  const match = path.match(/\/product-doctor\/sections\/[^/]+\/([^/]+)\.png$/)
  return match?.[1] || null
}

export function getDoctorSectionScreenDesigns(sectionId: string): ScreenDesignInfo[] {
  const screenDesigns: ScreenDesignInfo[] = []
  const prefix = `/src/sections-doctor/${sectionId}/`

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

export function getDoctorSectionScreenshots(sectionId: string): ScreenshotInfo[] {
  const screenshots: ScreenshotInfo[] = []
  const prefix = `/product-doctor/sections/${sectionId}/`

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

export function loadDoctorScreenDesignComponent(
  sectionId: string,
  screenDesignName: string,
): (() => Promise<{ default: ComponentType }>) | null {
  const path = `/src/sections-doctor/${sectionId}/${screenDesignName}.tsx`
  return screenDesignModules[path] || null
}

export function loadDoctorSectionData(sectionId: string): SectionData {
  const specPath = `/product-doctor/sections/${sectionId}/spec.md`
  const dataPath = `/product-doctor/sections/${sectionId}/data.json`

  const specContent = specFiles[specPath] || null
  const dataModule = dataFiles[dataPath]
  const data = dataModule?.default || null

  return {
    sectionId,
    spec: specContent,
    specParsed: specContent ? parseSpec(specContent) : null,
    data,
    screenDesigns: getDoctorSectionScreenDesigns(sectionId),
    screenshots: getDoctorSectionScreenshots(sectionId),
  }
}

export function hasDoctorSectionSpec(sectionId: string): boolean {
  return `/product-doctor/sections/${sectionId}/spec.md` in specFiles
}

export function hasDoctorSectionData(sectionId: string): boolean {
  return `/product-doctor/sections/${sectionId}/data.json` in dataFiles
}

export function getAllDoctorSectionIds(): string[] {
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
