/**
 * Legacy barrel — the canonical source has moved to `src/lib/caritasProjects.ts`.
 * We keep this file as a thin re-export so any lingering `from '../data'` or
 * `from './data'` import keeps working (and CRA's build graph stays clean).
 */
export {
  caritasProjects,
  generalImpactImages,
  partnerLogosForSite,
  getProjectBySlug,
  getProjectByRoute,
  getActiveProjects,
  getDonorFundedProjects,
} from '../lib/caritasProjects';
export type { CaritasProject } from '../lib/caritasProjects';
