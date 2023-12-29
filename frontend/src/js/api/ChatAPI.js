import Entity from './Entity';
import createRequest from './createRequest';

export default class ChatAPI extends Entity {
  static async list() {
    return createRequest({ method: 'GET', url: '/users' });
  }

  static async get(id) {
    return createRequest({ method: 'GET', url: `/user/${id}` });
  }

  static async create(name) {
    return createRequest({ method: 'POST', url: '/new-user', body: { name } });
  }

  static async update(id, name) {
    return createRequest({ method: 'PUT', url: `/user/${id}`, body: { name } });
  }

  static async delete(id) {
    return createRequest({ method: 'DELETE', url: `/user/${id}` });
  }
}
