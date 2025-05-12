// jest.setup.js
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

fetchMock.mockResponse(async () => ({
  body: JSON.stringify({ data: [] }),
  init: { status: 200 },
}));
