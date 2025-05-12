
// Fetch and display breed list
export async function fetchAndDisplayBreeds() {
    const breedList = document.getElementById('breed-list');
    
    try {
        const res = await fetch('https://dogapi.dog/api/v2/breeds');
        
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        
        const json = await res.json();
        const data = json.data;
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

// Fetch and display details for a specific breed
export async function fetchBreedDetails(id) {
    const breedDetails = document.getElementById('breed-details');
    
    try {
        breedDetails.innerHTML = '<p>Loading details…</p>';
        const res = await fetch(`https://dogapi.dog/api/v2/breeds/${id}`);
        
        if (!res.ok) throw new Error('Breed not found');
        
        const { data: { attributes: b } } = await res.json();
        breedDetails.innerHTML = `
        <h2>${b.name}</h2>
        <p><strong>Description:</strong> ${b.description || 'No description available'}</p>
        <p><strong>Life Expectancy:</strong> ${b.life.min} - ${b.life.max} years</p>
        <p><strong>Male Weight:</strong> ${b.male_weight.min} - ${b.male_weight.max} lbs</p>
        <p><strong>Female Weight:</strong> ${b.female_weight.min} - ${b.female_weight.max} lbs</p>
        <p><strong>Hypoallergenic:</strong> ${b.hypoallergenic ? 'Yes' : 'No'}</p>
        `;
    } catch (err) {
        breedDetails.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
}

// Fetch and display random dog facts
export async function fetchDogFacts() {
    const dogFacts = document.getElementById('dog-facts');
    
    try {
        const res = await fetch('https://dogapi.dog/api/v2/facts');
        const { data } = await res.json();
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

// Fetch and display dog groups
export async function fetchDogGroups() {
    const dogGroups = document.getElementById('dog-groups');
    
    try {
        const res = await fetch('https://dogapi.dog/api/v2/groups');
        const { data } = await res.json();
        dogGroups.innerHTML = '';
        
        for (const group of data) {
            const li = document.createElement('li');
            li.textContent = group.attributes.name;
            dogGroups.appendChild(li);
        }
    } catch (err) {
        dogGroups.innerHTML = `<li style="color:red;">Error fetching groups: ${err.message}</li>`;
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        fetchAndDisplayBreeds();
        fetchDogFacts();
        fetchDogGroups();
    });
}
