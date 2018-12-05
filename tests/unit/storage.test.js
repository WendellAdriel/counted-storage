import 'mock-local-storage'
import CountedStorage from '../../src/storage'

const TEST_NAMESPACE = 'counted-storage-test'
const storage = new CountedStorage(TEST_NAMESPACE)

describe('Testing with mock localStorage', () => {
  afterEach(() => global.localStorage.clear())

  it('buildKey() must return the right key for the counted storage', () => {
    expect(storage.buildKey('my_key')).toBe(`${TEST_NAMESPACE}_my_key`)
  })

  it(
    'get() without default value must return null when no item is set',
    () => {
      expect(storage.get('test')).toBe(null)
    }
  )

  it(
    'get() with default value must return default value when no item is set',
    () => {
      expect(storage.get('test', 'default')).toBe('default')
    }
  )

  it(
    'get() must return the item value when item is set and valid',
    () => {
      const storeObject = {
        use_count: 0,
        use_validity: 1,
        data: 'my_data'
      }
      global.localStorage.setItem(
        `${TEST_NAMESPACE}_value`,
        JSON.stringify(storeObject)
      )

      expect(storage.get('value')).toBe('my_data')
    }
  )

  it(
    'get() without default value must return null when item is set and invalid',
    () => {
      const storeObject = {
        use_count: 1,
        use_validity: 1,
        data: 'my_data'
      }
      global.localStorage.setItem(
        `${TEST_NAMESPACE}_value`,
        JSON.stringify(storeObject)
      )

      expect(storage.get('value')).toBe(null)
    }
  )

  it(
    'get() with default value must return default when item is set and invalid',
    () => {
      const storeObject = {
        use_count: 2,
        use_validity: 2,
        data: 'my_data'
      }
      global.localStorage.setItem(
        `${TEST_NAMESPACE}_value`,
        JSON.stringify(storeObject)
      )

      expect(storage.get('value', 'default_value')).toBe('default_value')
    }
  )

  it(
    'set() must set an item to the local storage using the given namespace',
    () => {
      storage.set('my_key', 'my_value')

      expect(storage.get('my_key')).toBe('my_value')
    }
  )

  it('remove() must remove an item from the local storage', () => {
    storage.set('my_key', 'my_value')
    storage.remove('my_key')

    expect(storage.get('my_key')).toBe(null)
  })

  it('getAll() must return all items from the counted storage', () => {
    storage.set('my_key', 'my_value')
    storage.set('my_second_key', 'my_second_value')

    const storageItems = storage.getAll()
    expect(Object.keys(storageItems).length).toBe(2)
  })

  it('clear() must remove all items from the counted storage', () => {
    storage.set('my_key', 'my_value')
    storage.set('my_second_key', 'my_second_value')
    storage.clear()

    const storageItems = storage.getAll()
    expect(Object.keys(storageItems).length).toBe(0)
  })
})
