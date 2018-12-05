const DEFAULT_VALIDITY = 1

/**
 * Class that encapsulates all the actions for the local storage
 */
export default class {
  /**
   * Creates a new instance of the storage class
   *
   * @param {String} namespace
   * @param {Number} defaultValidity
   */
  constructor (namespace, defaultValidity = DEFAULT_VALIDITY) {
    this.namespace = namespace
    this.defaultValidity = defaultValidity
    this.storage = window.localStorage
  }

  /**
   * Gets an item from this counted storage or returns
   * the default value when no item is found
   * or if the item is not valid
   *
   * @param {String} key
   * @param {any} defaultValue
   * @returns {any}
   */
  get (key, defaultValue = null) {
    const itemKey = this.buildKey(key)
    const value = this.storage.getItem(itemKey)
    if (value === undefined || value === null) return defaultValue

    const parsed = JSON.parse(value)
    if (parsed.use_count >= parsed.use_validity) {
      this.remove(key)
      return defaultValue
    }

    parsed.use_count++
    this.storage.setItem(itemKey, JSON.stringify(parsed))

    return parsed.data
  }

  /**
   * Gets all the valid values of this counted storage
   *
   * @returns {Object}
   */
  getAll () {
    const values = Object.keys(this.storage)
      .filter(key => key.startsWith(this.namespace))
      .map(key => {
        const parsed = JSON.parse(this.storage.getItem(key))
        parsed.key = key
        return parsed
      })

    const formatted = {}
    const filtered = values.filter(item => item.use_count < item.use_validity)

    filtered.forEach(item => (formatted[item.key] = item.data))
    return formatted
  }

  /**
   * Sets an item to this counted storage
   *
   * @param {String} key
   * @param {any} value
   * @param {Number} validFor
   */
  set (key, value, validFor = this.defaultValidity) {
    const storeObject = {
      use_count: 0,
      use_validity: validFor,
      data: value
    }

    this.storage.setItem(this.buildKey(key), JSON.stringify(storeObject))
  }

  /**
   * Removes an item from this counted storage
   *
   * @param {String} key
   */
  remove (key) {
    this.storage.removeItem(this.buildKey(key))
  }

  /**
   * Removes all items from this counted storage
   */
  clear () {
    Object.keys(this.storage)
      .filter(key => key.startsWith(this.namespace))
      .map(key => this.storage.removeItem(key))
  }

  /**
   * Builds the storage key
   *
   * @param {String} key
   * @returns {String}
   */
  buildKey (key) {
    return `${this.namespace}_${key}`
  }
}
