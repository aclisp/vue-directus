/**
 * represent the local storage
 */
export class Storage {
  static LOCAL_STORAGE_KEY = "sMo37rQdbm";
  _accessToken = "";
  _refreshToken = "";
  /** UTC milliseconds when this value expires */
  _expiresAt = 0;

  constructor(loginInfo) {
    if (loginInfo) {
      this._accessToken = loginInfo.access_token;
      this._refreshToken = loginInfo.refresh_token;
      this._expiresAt = Date.now() + loginInfo.expires;
    }
  }

  /**
   * @returns {Storage|null}
   */
  static load() {
    const item = localStorage.getItem(Storage.LOCAL_STORAGE_KEY);
    if (!item) {
      return null;
    }

    const object = JSON.parse(item);
    const storage = new Storage();
    storage._accessToken = object.a;
    storage._refreshToken = object.r;
    storage._expiresAt = object.e;
    return storage;
  }

  save() {
    const item = JSON.stringify({
      a: this.accessToken,
      r: this.refreshToken,
      e: this.expiresAt,
    });
    localStorage.setItem(Storage.LOCAL_STORAGE_KEY, item);
  }

  static reset() {
    localStorage.removeItem(Storage.LOCAL_STORAGE_KEY);
  }

  get expiresAt() {
    return this._expiresAt;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  get accessToken() {
    return this._accessToken;
  }

  get expiresDate() {
    return new Date(this.expiresAt).toLocaleString();
  }
}
