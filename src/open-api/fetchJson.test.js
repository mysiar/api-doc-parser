import fetchJson from './fetchJson';

test('fetch a JSON document', () => {
  fetch.mockResponseOnce(`{
    "name": "John Lennon",
    "born": "1940-10-09"
}`, {status: 200, statusText: 'OK', headers: new Headers({'Content-Type': 'application/json'})});

  return fetchJson('/foo.json').then(data => {
      expect(data.response.ok).toBe(true);
      expect(data.body.name).toBe('John Lennon');
    }
  );
});

test('fetch a non JSON document', () => {
  fetch.mockResponseOnce(`<body>Hello</body>`, {status: 200, statusText: 'OK', headers: new Headers({'Content-Type': 'text/html'})});

  return fetchJson('/foo.json').catch(data => {
      expect(data.response.ok).toBe(true);
      expect(typeof data.body).toBe('undefined');
    }
  );
});

test('fetch an error', () => {
  fetch.mockResponseOnce(`{
    "name": "John Lennon",
    "born": "1940-10-09"
}`, {status: 400, statusText: 'Bad Request', headers: new Headers({'Content-Type': 'application/json'})});

  return fetchJson('/foo.json').catch(({response}) => {
    response.json().then(body => {
      expect(response.ok).toBe(false);
      expect(body.born).toBe('1940-10-09');
    });
  });
});

test('fetch an empty document', () => {
  fetch.mockResponseOnce('', {status: 204, statusText: 'No Content', headers: new Headers({'Content-Type': 'text/html'})});

  return fetchJson('/foo.json').then(({response}) => {
    expect(response.ok).toBe(true);
    expect(response.body).toBe(undefined);
  });
});
