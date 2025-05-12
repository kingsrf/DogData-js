
import {
  fetchAndDisplayBreeds,
  fetchBreedDetails,
  fetchDogFacts,
  fetchDogGroups
} from '../main.js';

beforeEach(() => {
  // Reset DOM and fetch mock before each test
  document.body.innerHTML = `
    <ul id="breed-list"></ul>
    <section id="breed-details"></section>
    <ul id="dog-facts"></ul>
    <ul id="dog-groups"></ul>
  `;
  fetch.resetMocks();
});

describe('Normal cases', () => {
  test('fetchAndDisplayBreeds renders list items', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      data: [ { id: '1', attributes: { name: 'Foo' } } ]
    }));

    await fetchAndDisplayBreeds();
    const items = document.querySelectorAll('#breed-list li');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe('Foo');
  });

  test('fetchBreedDetails shows breed info', async () => {
    const mockBreed = {
      data: {
        attributes: {
          name: 'Bar',
          description: '',
          life: { min: 1, max: 2 },
          male_weight: { min: 3, max: 4 },
          female_weight: { min: 5, max: 6 },
          hypoallergenic: false
        }
      }
    };
    fetch.mockResponseOnce(JSON.stringify(mockBreed));

    await fetchBreedDetails('1');
    const details = document.getElementById('breed-details').innerHTML;
    expect(details).toContain('<h2>Bar</h2>');
    expect(details).toContain('1 - 2 years');
  });

  test('fetchDogFacts appends facts', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      data: [ { attributes: { body: 'Fact1' } } ]
    }));

    await fetchDogFacts();
    const factItems = document.querySelectorAll('#dog-facts li');
    expect(factItems).toHaveLength(1);
    expect(factItems[0].textContent).toBe('Fact1');
  });
});

describe('Edge cases', () => {
  test('fetchAndDisplayBreeds handles HTTP error', async () => {
    fetch.mockResponseOnce('', { status: 500 });

    await fetchAndDisplayBreeds();
    expect(document.querySelector('#breed-list').textContent)
      .toMatch(/Error loading breeds/);
  });

  test('fetchBreedDetails handles missing breed', async () => {
    fetch.mockResponseOnce('', { status: 404 });

    await fetchBreedDetails('x');
    expect(document.getElementById('breed-details').textContent)
      .toMatch(/Error:/);
  });

  test('fetchDogGroups handles network failure', async () => {
    fetch.mockRejectOnce(new Error('network fail'));

    await fetchDogGroups();
    expect(document.querySelector('#dog-groups').textContent)
      .toMatch(/Error fetching groups/);
  });
});
