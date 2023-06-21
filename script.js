const submitButton = document.getElementById('submit-button');
const messageInput = document.getElementById('message');
const responseContainer = document.getElementById('response-container');
const responseElement = document.getElementById('response');
const resetButton = document.createElement('button');
resetButton.id = 'reset-button';
resetButton.className = 'submit-button-red'; // Add CSS class for red button style
resetButton.textContent = 'Ask Another Question';
resetButton.addEventListener('click', handleReset);

submitButton.addEventListener('click', handleSubmit);
messageInput.addEventListener('keyup', handleKeyUp);

const loadingMessage = "Chill out. I'm thinking";
const loadingAnimationDelay = 500; // Delay between each dot (in milliseconds)
let loadingAnimationInterval;

const engine = 'davinci'; // Define the OpenAI engine

function handleSubmit() {
  const userInput = messageInput.value.trim();
  if (userInput === '') return;

  // Hide the input container
  messageInput.style.display = 'none';
  submitButton.style.display = 'none';

  // Show loading message with typewriter effect
  typeWriterLoadingMessage(loadingMessage);

  // Make the API call to OpenAI
  makeOpenAIAPIRequest(userInput)
    .then(answer => {
      console.log('API Response:', answer);
      stopLoadingAnimation();
      typeWriter(answer);
    })
    .catch(error => {
      console.error('Error:', error);
      stopLoadingAnimation();
      replaceInputWithResponse('Sorry, something went wrong. Please try again.');
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

  const apiKey = process.env.OPENAI_API_KEY; // Get the API key from environment variable

  return fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}` // Use the API key here
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

function typeWriterLoadingMessage(message) {
  let i = 0;
  const typingDelay = 100; // Adjust the delay for faster typing

  responseElement.textContent = ''; // Clear existing content
  responseElement.style.fontSize = '18px'; // Adjust the font size as needed
  responseElement.style.textAlign = 'center'; // Center the text

  function typeNextChar() {
    if (i < message.length) {
      responseElement.textContent += message.charAt(i);
      i++;
      setTimeout(typeNextChar, typingDelay);
    } else {
      // Start the loading animation after typing is complete
      startLoadingAnimation();
    }
  }

  typeNextChar();
}

function typeWriter(text) {
  let i = 0;
  const typingDelay = 20; // Adjust the delay for faster typing

  responseElement.textContent = ''; // Clear existing content
  responseElement.style.fontSize = '18px'; // Adjust the font size as needed
  responseElement.style.textAlign = 'center'; // Center the text

  function typeNextChar() {
    if (i < text.length) {
      responseElement.textContent += text.charAt(i);
      i++;
      setTimeout(typeNextChar, typingDelay);
    } else {
      // Display 'Ask Another Question' button after typing is complete
      responseContainer.appendChild(resetButton);
    }
  }

  typeNextChar();
}

function replaceInputWithResponse(response) {
  responseElement.textContent = response;
  // Display 'Ask Another Question' button
  responseContainer.appendChild(resetButton);
}

function startLoadingAnimation() {
  let dotCount = 0;
  responseElement.textContent = loadingMessage;

  loadingAnimationInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    responseElement.textContent = loadingMessage + '.'.repeat(dotCount);
  }, loadingAnimationDelay);
}

function stopLoadingAnimation() {
  clearInterval(loadingAnimationInterval);
}

function handleReset() {
  // Reset the form
  messageInput.value = '';
  messageInput.style.display = 'block';
  submitButton.style.display = 'block';

  // Clear the response
  responseElement.textContent = '';
  responseContainer.innerHTML = '';
  stopLoadingAnimation();
}
