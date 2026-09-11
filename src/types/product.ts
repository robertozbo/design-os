/**
 * Product types for Design OS v2
 */

// =============================================================================
// Product Overview
// =============================================================================

export interface Problem {
  title: string
  solution: string
}

export interface ProductOverview {
  name: string
  description: string
  problems: Problem[]
  features: string[]
}

// =============================================================================
// Product Roadmap
// =============================================================================

export interface Section {
  id: string
  title: string
  description: string
  order: number
  group?: string
}

export interface ProductRoadmap {
  sections: Section[]
}

// =============================================================================
// Data Shape
// =============================================================================

export interface Entity {
  name: string
  description: string
}

export interface DataShape {
  entities: Entity[]
  relationships: string[]
}

// =============================================================================
// Design System
// =============================================================================

export interface ColorTokens {
  primary: string
  secondary: string
  neutral: string
  accent?: string
}

export interface TypographyTokens {
  heading: string
  body: string
  mono: string
}

export interface DesignSystem {
  colors: ColorTokens | null
  typography: TypographyTokens | null
}

// =============================================================================
// Application Shell
// =============================================================================

export interface ShellNavGroup {
  /** Heading text, e.g. "SST · NR-1" (###) or "Treinamentos" (####) */
  title: string
  /** 3 = context group (###), 4 = sub-group label inside it (####) */
  level: 3 | 4
  items: string[]
}

export interface ShellSpec {
  raw: string
  overview: string
  navigationItems: string[]
  /** Same items, grouped by the ###/#### headings under Navigation Structure (in order) */
  navigationGroups: ShellNavGroup[]
  layoutPattern: string
}

export interface ShellInfo {
  spec: ShellSpec | null
  hasComponents: boolean
}

// =============================================================================
// Combined Product Data
// =============================================================================

export interface ProductData {
  overview: ProductOverview | null
  roadmap: ProductRoadmap | null
  dataShape: DataShape | null
  designSystem: DesignSystem | null
  shell: ShellInfo | null
}
