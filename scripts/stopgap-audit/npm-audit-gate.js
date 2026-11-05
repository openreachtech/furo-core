import {
  NpmAuditGate,
} from '@openreachtech/mentsu-npm-audit-gate'

/**
 * Advisories the gate lets through as a stopgap until a release fixes them.
 *
 * @type {Array<NpmAuditType.IgnoredAdvisory>}
 */
const IGNORED_ADVISORIES = [
  {
    id: 'GHSA-gcqx-w48m-w2h4',
    package: 'deepmerge',
    path: 'jest > jest-config > deepmerge',
    reason: 'No patched release: the advisory covers deepmerge >=4.2.0 <=4.3.1, and 4.3.1 (published 2023-03-16) is the latest. The flaw is prototype poisoning through mergeObject() when a source object carries attacker-chosen keys. deepmerge arrives only through jest-config, a development dependency that merges this repository\'s own Jest configuration and presets, and the published package carries lib/ and types/ alone, so it never reaches a consumer.',
    removeWhen: 'deepmerge publishes a release outside <=4.3.1 and an override "deepmerge": "^<that version>" takes it, or jest-config stops depending on it',
  },
]

const npmAuditGate = NpmAuditGate.create({
  ignoredAdvisories: IGNORED_ADVISORIES,
})

process.exitCode = npmAuditGate.auditAdvisories()
