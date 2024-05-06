function sendFRD() {
    const frd = document.getElementById('frdInput').value;
    const apiUrl = 'https://api.getknit.ai/v1/router/run';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTEzMjcyNTc0OTM0MjAyMDAzMzE4In0sImlhdCI6MTcxNDQ2MjQzMywiZXhwIjoxNzE1NTQyNDMzfQ.5N23ymdqa3swMb2x9qY7vtiUn05wP6eJB0V06Ogy6bE'; // Replace with your actual token
    const headers = {
        'Content-Type': 'application/json',
        'x-auth-token': token
    };

    const rangePrompt = `
    You are a python json range generator.
    Analyze the document and extract all range values, ensuring they are constants without units.
    Example FRD segment:
    "${frd.split('_RANGE_END_TAG_')[0]}"
    `;

    const equationPrompt = `
    You are a python equation generator.
    Analyze the document for variables and equations following technical conditions.
    Example FRD segment:
    "${frd.split('_RANGE_END_TAG_')[1]}"
    `;

    const body = {
        model: 'openai/gpt-4-1106-preview',
        messages: frd.includes('_RANGE_END_TAG_') ? rangePrompt + equationPrompt : "Document is missing a range end tag.",
        messages: [
            {
                role: "system",
                content: rangePrompt
            },
            {
                role: "user",
                content: frd
            }
        ]
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('Error:', error));
}
