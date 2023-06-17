const submitButton = document.getElementById('submit-button');
const messageInput = document.getElementById('message');
const responseContainer = document.querySelector('.response-container');

// Replace 'YOUR_API_KEY' with your actual OpenAI API key
const apiKey = 'YOUR_API_KEY';
const engine = 'text-davinci-003';

submitButton.addEventListener('click', handleSubmit);
messageInput.addEventListener('keyup', handleKeyUp);

function handleSubmit() {
  const userInput = messageInput.value.trim();
  if (userInput === '') return;

  // Disable the submit button and display loading text
  submitButton.disabled = true;
  submitButton.value = 'Loading...';

  // Make the API call to OpenAI
  makeOpenAIAPIRequest(userInput)
    .then(answer => {
      console.log('API Response:', answer);
      replaceInputWithResponse(answer);
    })
    .catch(error => {
      console.error('Error:', error);
      replaceInputWithResponse('Sorry, something went wrong. Please try again.');
    })
    .finally(() => {
      // Enable the submit button and change the text back to 'Submit'
      submitButton.disabled = false;
      submitButton.value = 'Submit';
    });
}

function handleKeyUp(event) {
  if (event.key === 'Enter') {
    handleSubmit();
  }
}

function makeOpenAIAPIRequest(input) {
  const prompt = 'Edit the grammar and incorporate a friendly and professional tone in the message provided. You may utilize HTML tags limited to no more than <b>, <href>, and <i> where considered necessary to enhance readability, except in the salutation. Additionally, please include an expectation that in the event there is no response, I will follow up no later than tomorrow by 5:00 pm MDT. Apply all these instructions to the following message:\n';
  const concatenatedInput = prompt + input;

  const requestData = {
    prompt: concatenatedInput,
    max_tokens: 200,
    temperature: 0.0
  };

  return fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      const { choices } = data;
      if (choices && choices.length > 0) {
        return choices[0].text.trim();
      } else {
        throw new Error('Invalid API response');
      }
    });
}

function replaceInputWithResponse(response) {
  const responseElement = document.createElement('div');
  responseElement.className = 'response';
  responseElement.textContent = response;

  const resetButton = document.createElement('button');
  resetButton.id = 'reset-button';
  resetButton.className = 'submit-button-red'; // Add CSS class for red button style
  resetButton.textContent = 'Ask Another Question';
  resetButton.addEventListener('click', handleReset);

  messageInput.style.display = 'none';
  submitButton.style.display = 'none';
  responseContainer.innerHTML = '';
  responseContainer.appendChild(responseElement);
  responseContainer.appendChild(resetButton);
}

function handleReset() {
  messageInput.value = '';
  messageInput.style.display = 'block';
  submitButton.style.display = 'block';
  responseContainer.innerHTML = '';
}

