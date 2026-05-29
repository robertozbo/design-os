import { createBrowserRouter } from 'react-router-dom'
import { ProductPage } from '@/components/ProductPage'
import { DataShapePage } from '@/components/DataShapePage'
import { DesignPage } from '@/components/DesignPage'
import { SectionsPage } from '@/components/SectionsPage'
import { SectionPage } from '@/components/SectionPage'
import { ScreenDesignPage, ScreenDesignFullscreen } from '@/components/ScreenDesignPage'
import { ShellDesignPage, ShellDesignFullscreen } from '@/components/ShellDesignPage'
import { ExportPage } from '@/components/ExportPage'
import { MobileSectionsPage, MobileSectionPage } from '@/components/MobilePage'
import { PsicologoSectionsPage, PsicologoSectionPage } from '@/components/PsicologoPage'
import { PersonalSectionsPage, PersonalSectionPage } from '@/components/PersonalPage'
import { ClinicoSectionsPage, ClinicoSectionPage } from '@/components/ClinicoPage'
import { FisioSectionsPage, FisioSectionPage } from '@/components/FisioPage'
import ClinicoShellPreview from '@/shell-clinico/ShellPreview'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProductPage />,
  },
  {
    path: '/data-shape',
    element: <DataShapePage />,
  },
  {
    path: '/design',
    element: <DesignPage />,
  },
  {
    path: '/sections',
    element: <SectionsPage />,
  },
  {
    path: '/sections/:sectionId',
    element: <SectionPage />,
  },
  {
    path: '/sections/:sectionId/screen-designs/:screenDesignName',
    element: <ScreenDesignPage />,
  },
  {
    path: '/sections/:sectionId/screen-designs/:screenDesignName/fullscreen',
    element: <ScreenDesignFullscreen />,
  },
  {
    path: '/shell/design',
    element: <ShellDesignPage />,
  },
  {
    path: '/shell/design/fullscreen',
    element: <ShellDesignFullscreen />,
  },
  {
    path: '/export',
    element: <ExportPage />,
  },
  {
    path: '/mobile',
    element: <MobileSectionsPage />,
  },
  {
    path: '/mobile/sections/:sectionId',
    element: <MobileSectionPage />,
  },
  {
    path: '/psicologo',
    element: <PsicologoSectionsPage />,
  },
  {
    path: '/psicologo/sections/:sectionId',
    element: <PsicologoSectionPage />,
  },
  {
    path: '/personal',
    element: <PersonalSectionsPage />,
  },
  {
    path: '/personal/sections/:sectionId',
    element: <PersonalSectionPage />,
  },
  {
    path: '/clinico',
    element: <ClinicoSectionsPage />,
  },
  {
    path: '/clinico/shell',
    element: <ClinicoShellPreview />,
  },
  {
    path: '/clinico/sections/:sectionId',
    element: <ClinicoSectionPage />,
  },
  {
    path: '/fisio',
    element: <FisioSectionsPage />,
  },
  {
    path: '/fisio/sections/:sectionId',
    element: <FisioSectionPage />,
  },
])
