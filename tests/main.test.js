import {
  fetchAndDisplayBreeds,
  fetchBreedDetails,
  fetchDogFacts
} from '../main.js';

beforeEach(() => {
  // Reset DOM and fetch mock before each test
  document.body.innerHTML = `
    <ul id="breed-list"></ul>
    <section id="breed-details"></section>
    <ul id="dog-facts"></ul>
  `;
  fetch.resetMocks();
});

describe('fetchAndDisplayBreeds', () => {
  test('renders list items', async () => {
    // Mock breed list with pagination metadata
    fetch.mockResponseOnce(JSON.stringify({
      data: [ { id: '1', attributes: { name: 'Foo' } } ],
      meta: { pagination: { current: 1, last: 1 } }
    }));

    await fetchAndDisplayBreeds();
    const items = document.querySelectorAll('#breed-list li');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe('Foo');
  });

  test('handles HTTP error', async () => {
    fetch.mockResponseOnce('', { status: 500 });

    await fetchAndDisplayBreeds();
    expect(document.querySelector('#breed-list').textContent)
      .toMatch(/Error loading breeds/);
  });
});

describe('fetchBreedDetails', () => {
  test('shows breed info and group', async () => {
    const mockBreed = {
      data: {
        id: '1',
        attributes: {
          name: 'Bar',
          description: '',
          life: { min: 1, max: 2 },
          male_weight: { min: 3, max: 4 },
          female_weight: { min: 5, max: 6 },
          hypoallergenic: false
        },
        relationships: {
          group: { data: { id: 'g1', type: 'group' } }
        }
      }
    };
    const mockGroup = {
      data: {
        id: 'g1',
        type: 'group',
        attributes: { name: 'Herding' }
      }
    };

    // First fetch (breed) then second (group)
    fetch.mockResponses(
      [ JSON.stringify(mockBreed), { status: 200 } ],
      [ JSON.stringify(mockGroup), { status: 200 } ]
    );

    await fetchBreedDetails('1');
    const html = document.getElementById('breed-details').innerHTML;
    expect(html).toContain('<h2>Bar</h2>');
    expect(html).toContain('1 - 2 years');
    expect(html).toContain('<strong>Group:</strong> Herding');
  });

  test('handles missing breed', async () => {
    fetch.mockResponseOnce('', { status: 404 });

    await fetchBreedDetails('x');
    expect(document.getElementById('breed-details').textContent)
      .toMatch(/Error:/);
  });
});

describe('fetchDogFacts', () => {
  test('appends facts', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      data: [ { attributes: { body: 'Fact1' } } ]
    }));

    await fetchDogFacts();
    const factItems = document.querySelectorAll('#dog-facts li');
    expect(factItems).toHaveLength(1);
    expect(factItems[0].textContent).toBe('Fact1');
  });
});
