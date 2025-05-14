
// To keep track of page state
let currentPage = 1;
let lastPage = 1;

// 1) Fetches & displays breeds for any page
export async function fetchAndDisplayBreeds(page = 1) {
    const breedList = document.getElementById('breed-list');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const currentPageEl = document.getElementById('current-page');
    const totalPagesEl = document.getElementById('total-pages');
    
    try {
        const res = await fetch(
            `https://dogapi.dog/api/v2/breeds?page[number]=${page}&page[size]=20`
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const json = await res.json();
        const data = json.data;
        const pagination = json.meta?.pagination;

        // updates the pagination state
        if (pagination) {
            currentPage = pagination.current;
            lastPage = pagination.last;
            if(prevBtn) prevBtn.disabled = false;
            if(nextBtn) nextBtn.disabled = false;
            if(currentPageEl) currentPageEl.textContent = pagination.current;
            if(totalPagesEl) totalPagesEl.textContent = pagination.last;
        }

        // renders the list of breeds
        breedList.innerHTML = '';
        for (const breed of data) {
            const li = document.createElement('li');
            li.textContent = breed.attributes.name;
            li.addEventListener('click', () => fetchBreedDetails(breed.id));
            breedList.appendChild(li);
        }
    } catch (err) {
        breedList.innerHTML = `<li style="color:red;">Error loading breeds: ${err.message}</li>`;
    }
}

// wiring clicks
function setupPagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prevPage = currentPage - 1 < 1 ? lastPage : currentPage - 1;
            fetchAndDisplayBreeds(prevPage);
        });
    }

    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            const nextPage = currentPage < lastPage ? currentPage + 1 : 1;
            fetchAndDisplayBreeds(nextPage);
        });
    }
}

// 2) Fetches and displays details for a specific breed
export async function fetchBreedDetails(id) {
    const breedDetails = document.getElementById('breed-details');
    
    try {
        breedDetails.innerHTML = '<p>Loading details…</p>';

        // i) gets the breed details
        const res1 = await fetch(`https://dogapi.dog/api/v2/breeds/${id}`);
        if (!res1.ok) throw new Error('Breed not found');
        const {data} = await res1.json();
        const b = data.attributes;
        // gets the group ID from relationships
        const groupId = data.relationships.group.data.id;

        // ii) fetches the group by its ID
        const res2 = await fetch(`https://dogapi.dog/api/v2/groups/${groupId}`);
        if (!res2.ok) throw new Error('Group not found');
        const {data: groupData} = await res2.json();
        const groupName = groupData.attributes.name;
        
        breedDetails.innerHTML = `
        <h2>${b.name}</h2>
        <p><strong>Description:</strong> ${b.description || 'No description available'}</p>
        <p><strong>Life Expectancy:</strong> ${b.life.min} - ${b.life.max} years</p>
        <p><strong>Male Weight:</strong> ${b.male_weight.min} - ${b.male_weight.max} lbs</p>
        <p><strong>Female Weight:</strong> ${b.female_weight.min} - ${b.female_weight.max} lbs</p>
        <p><strong>Hypoallergenic:</strong> ${b.hypoallergenic ? 'Yes' : 'No'}</p>
        <p><strong>Group:</strong> ${groupName}</p>
        `;
    } catch (err) {
        breedDetails.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
}

// 3) Fetches and displays random dog facts
export async function fetchDogFacts() {
    const dogFacts = document.getElementById('dog-facts');
    
    try {
        const res = await fetch('https://dogapi.dog/api/v2/facts');
        const {data} = await res.json();

        dogFacts.innerHTML = ''; 
        for (const fact of data) {
            const li = document.createElement('li');
            li.textContent = fact.attributes.body;
            dogFacts.appendChild(li);
        }
    } catch (err) {
        dogFacts.innerHTML = `<li style="color:red;">Error fetching facts: ${err.message}</li>`;
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        setupPagination();
        fetchAndDisplayBreeds(1);
        fetchDogFacts();
    });
}
