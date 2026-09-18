/**
 * Admin section loader — mirrors section-loader.ts but for admin namespace.
 *
 * Paths:
 * - product-admin/sections/[id]/spec.md
 * - product-admin/sections/[id]/data.json
 * - src/sections-admin/[id]/[Page].tsx
 * - product-admin/sections/[id]/*.png
 */

import type { SectionData, ScreenDesignInfo, ScreenshotInfo } from '@/types/section'
import type { ComponentType } from 'react'
import { parseSpec } from './section-loader'

const specFiles = import.meta.glob('/product-admin/sections/*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const dataFiles = import.meta.glob('/product-admin/sections/*/data.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

const screenDesignModules = import.meta.glob('/src/sections-admin/*/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

const screenshotFiles = import.meta.glob('/product-admin/sections/*/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

function extractSectionIdFromProduct(path: string): string | null {
  const match = path.match(/\/product-admin\/sections\/([^/]+)\//)
  return match?.[1] || null
}

function extractSectionIdFromSrc(path: string): string | null {
  const match = path.match(/\/src\/sections-admin\/([^/]+)\//)
  return match?.[1] || null
}

function extractScreenDesignName(path: string): string | null {
  const match = path.match(/\/src\/sections-admin\/[^/]+\/([^/]+)\.tsx$/)
  return match?.[1] || null
}

function extractScreenshotName(path: string): string | null {
  const match = path.match(/\/product-admin\/sections\/[^/]+\/([^/]+)\.png$/)
  return match?.[1] || null
}

export function getAdminSectionScreenDesigns(sectionId: string): ScreenDesignInfo[] {
  const screenDesigns: ScreenDesignInfo[] = []
  const prefix = `/src/sections-admin/${sectionId}/`

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

export function getAdminSectionScreenshots(sectionId: string): ScreenshotInfo[] {
  const screenshots: ScreenshotInfo[] = []
  const prefix = `/product-admin/sections/${sectionId}/`

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

export function loadAdminScreenDesignComponent(
  sectionId: string,
  screenDesignName: string,
): (() => Promise<{ default: ComponentType }>) | null {
  const path = `/src/sections-admin/${sectionId}/${screenDesignName}.tsx`
  return screenDesignModules[path] || null
}

export function loadAdminSectionData(sectionId: string): SectionData {
  const specPath = `/product-admin/sections/${sectionId}/spec.md`
  const dataPath = `/product-admin/sections/${sectionId}/data.json`

  const specContent = specFiles[specPath] || null
  const dataModule = dataFiles[dataPath]
  const data = dataModule?.default || null

  return {
    sectionId,
    spec: specContent,
    specParsed: specContent ? parseSpec(specContent) : null,
    data,
    screenDesigns: getAdminSectionScreenDesigns(sectionId),
    screenshots: getAdminSectionScreenshots(sectionId),
  }
}

export function hasAdminSectionSpec(sectionId: string): boolean {
  return `/product-admin/sections/${sectionId}/spec.md` in specFiles
}

export function hasAdminSectionData(sectionId: string): boolean {
  return `/product-admin/sections/${sectionId}/data.json` in dataFiles
}

export function getAllAdminSectionIds(): string[] {
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
