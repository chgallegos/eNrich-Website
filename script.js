const submitButton = document.getElementById('submit-button');
const messageInput = document.getElementById('message');
const responseContainer = document.querySelector('.response-container');

submitButton.addEventListener('click', handleSubmit);
messageInput.addEventListener('keyup', handleKeyUp);

function handleSubmit() {
  const userInput = messageInput.value.trim();
  if (userInput === '') return;

  // Disable the submit button and display loading text
  submitButton.disabled = true;
  submitButton.value = 'Loading...';

  // Make the API call to ChatGPT
  makeChatGPTAPIRequest(userInput)
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

function makeChatGPTAPIRequest(input) {
  // Replace <YOUR_API_KEY> with your actual API key
  const apiKey = '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';
  const url = `https://api.openai.com/v1/engines/davinci-codex/completions`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  const data = {
    'prompt': input,
    'max_tokens': 50,
    'temperature': 0.7,
    'n': 1,
    'stop': '\n'
  };

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].text.trim();
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
