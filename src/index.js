import CountedStorage from './storage'
import * as Helpers from './helpers'

/**
 * Counted Storage Factory function to create a new Counted Storage
 * with the given values
 *
 * @param {String} namespace
 * @param {Number} defaultValidity
 */
export default function (namespace, defaultValidity = undefined) {
  if (!Helpers.isLocalStorageSupported()) return null
  if (!Helpers.isNamespaceValid(namespace)) return null

  return new CountedStorage(namespace, defaultValidity)
}
