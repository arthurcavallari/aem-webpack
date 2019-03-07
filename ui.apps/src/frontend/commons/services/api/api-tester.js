import $ from 'jquery';
import Url from 'domurl';
import { getPromise } from 'Commons/promiseCache';

/**
 * See: https://jsonplaceholder.typicode.com/
 * @param todoNumber
 * @param shouldFetch {boolean} Whether to use cached data
 * @returns {Promise}
 */
export function getTodos(todoNumber, shouldFetch = false) {

  return getPromise(`getTodos-${todoNumber}`, function (p) {
    const params = {
      headers: {},
    };

    let url = new Url('https://jsonplaceholder.typicode.com/todos/' + todoNumber);
    const dataPromise = $.ajax({
      url: url,
      type: 'get',
      headers: params.headers,
      contentType: 'application/json; charset=utf-8',
    });

    dataPromise.done(function (data) {
      p.resolve(data);
    }).fail(function (data) {
      p.reject(data);
    });
  }, shouldFetch);
}