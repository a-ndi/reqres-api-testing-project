class ApiClient {
  constructor(request, apiKey) {
    this.request = request;
    this.apiKey = apiKey;
  }

  withAuth(options = {}) {
    const headers = { ...(options.headers || {}) };
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }
    return { ...options, headers };
  }

  async get(path, options) {
    return this.request.get(path, this.withAuth(options));
  }

  async post(path, data, options) {
    return this.request.post(path, { data, ...this.withAuth(options) });
  }

  async put(path, data, options) {
    return this.request.put(path, { data, ...this.withAuth(options) });
  }

  async patch(path, data, options) {
    return this.request.patch(path, { data, ...this.withAuth(options) });
  }

  async delete(path, options) {
    return this.request.delete(path, this.withAuth(options));
  }
}

module.exports = { ApiClient };
