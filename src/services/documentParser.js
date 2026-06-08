/**
 * documentParser.js — thin wrapper for Onboarding.jsx + Improve.jsx
 *
 * Delegates all work to the cvImport engine.
 * Kept as a separate module so consumers don't need to know about internals.
 */

export { importCV as parseDocument } from './cvImport/index.js'

/**
 * Identity transform — importCV already returns a store-ready payload.
 * Kept as a separate step so future AI post-processing can be plugged in here.
 */
export function mapToStoreFormat(parsed) {
  return parsed
}
