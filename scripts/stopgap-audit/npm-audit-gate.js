import {
  NpmAuditGate,
} from '@openreachtech/mentsu-npm-audit-gate'

/**
 * Advisories the gate lets through as a stopgap until a release fixes them.
 *
 * @type {Array<NpmAuditType.IgnoredAdvisory>}
 * @example
 * const IGNORED_ADVISORIES = [
 *   {
 *     id: 'GHSA-xxxx-xxxx-xxxx',
 *     package: 'example-package',
 *     path: 'example-parent > example-package',
 *     reason: 'No patched release exists, and the vulnerable code path is not reached from this repository.',
 *     removeWhen: 'example-package publishes a release outside the affected range, or the advisory is withdrawn',
 *   },
 * ]
 */
const IGNORED_ADVISORIES = [
]

const npmAuditGate = NpmAuditGate.create({
  ignoredAdvisories: IGNORED_ADVISORIES,
})

process.exitCode = npmAuditGate.auditAdvisories()
