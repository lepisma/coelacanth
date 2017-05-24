/**
 * Merge two objects with nested data
 */
function mergeObject (oldObject, newObject) {
  let oldCopy = Object.assign({}, oldObject)

  function _merge (oo, no) {
    for (let key in no) {
      if (key in oo) {
        // Follow structure of oo
        if (oo[key] === Object(oo[key])) {
          _merge(oo[key], no[key])
        } else if (no[key] !== Object(no[key])) {
          oo[key] = no[key]
        }
      } else {
        // Plain assign
        oo[key] = no[key]
      }
    }
    return oo
  }

  return _merge(oldCopy, newObject)
}

/**
 * Main config class
 */
export default class Coelacanth {
  constructor (defaults, root = null) {
    this.proxy = new Proxy(this, {
      get: function (target, name) {
        if (typeof target[name] === 'function') {
          return function (...args) {
            return target[name].apply(this, args)
          }
        } else if (name in target._defaults) {
          return target._defaults[name]
        } else {
          return target[name]
        }
      },
      set: function (target, name, value) {
        target[name] = value
      }
    })

    // Initialize default values
    this.root = root || this.proxy
    this._defaults = {}
    for (let key in defaults) {
      if (defaults[key] === Object(defaults[key])) {
        this._defaults[key] = new Coelacanth(defaults[key], this.root)
      } else {
        this._defaults[key] = defaults[key]
      }
    }
    this._derivations = {}

    return this.proxy
  }

  derive (name, derivation) {
    this._derivations[name] = derivation

    Object.defineProperty(this, name, {
      get: () => derivation(this.proxy, this.root)
    })
  }

  _deriveCopy (object) {
    // Apply root level derivations
    for (let key in object._derivations) {
      this.derive(key, object._derivations[key])
    }

    // Apply to children
    for (let key in object._defaults) {
      if (this._defaults[key] === Object(this._defaults[key])) {
        this._defaults[key]._deriveCopy(object._defaults[key])
      }
    }
  }

  /**
   * Plain json getters
   */
  get defaults () {
    let out = {}
    for (let key in this._defaults) {
      if (this._defaults[key] === Object(this._defaults[key])) {
        out[key] = this._defaults[key].defaults
      } else {
        out[key] = this._defaults[key]
      }
    }
    return out
  }

  overwrite (newConfig) {
    let overwritten = new Coelacanth(mergeObject(this.defaults, newConfig))
    // Apply derivations
    overwritten._deriveCopy(this)
    return overwritten
  }
}
