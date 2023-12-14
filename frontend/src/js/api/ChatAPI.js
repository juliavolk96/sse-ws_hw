import Entity from './Entity';
import createRequest from './createRequest';

export default class ChatAPI extends Entity {
  async list() {
    return createRequest({ method: 'GET', url: '/users' });
  }

  async get(id) {
    return createRequest({ method: 'GET', url: `/user/${id}` });
  }

  async create(name) {
    return createRequest({ method: 'POST', url: '/new-user', body: { name } });
  }

  async update(id, name) {
    return createRequest({ method: 'PUT', url: `/user/${id}`, body: { name } });
  }

  async delete(id) {
    return createRequest({ method: 'DELETE', url: `/user/${id}` });
  }
}
