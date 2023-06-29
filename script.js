const submitButton = document.getElementById('submit-button');
const messageInput = document.getElementById('message');
const responseContainer = document.getElementById('response-container');
const responseElement = document.getElementById('response');
const resetButton = document.createElement('button');
resetButton.id = 'reset-button';
resetButton.className = 'submit-button-red'; // Add CSS class for red button style
resetButton.textContent = 'Ask Another Question';
resetButton.addEventListener('click', handleReset);

// Replace 'YOUR_API_KEY' with your actual OpenAI API key
const apiKey = '';
const engine = 'text-davinci-003';

submitButton.addEventListener('click', handleSubmit);
messageInput.addEventListener('keyup', handleKeyUp);

const loadingMessage = "Chill out. I'm thinking";
const loadingAnimationDelay = 500; // Delay between each dot (in milliseconds)
let loadingAnimationInterval;

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
    .then(response => {
      console.log('API Response:', response);
      stopLoadingAnimation();
      typeWriter(response);
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
  const prompt = "Please edit the grammar and ensure a friendly and professional tone in the provided message. Feel free to use formatting, such as bold, and italic to emphasize important points and enhance readability (except in the salutation). Additionally, kindly include an expectation that if there is no response from them today, I will follow up no later than tomorrow by 5:00 pm MDT. Please begin the message with a greeting expressing gratitude for their previous response. Please limit your response to only include the content from the greeting onward. Please apply these instructions to the following message:";
  const concatenatedInput = prompt + input;

  const requestData = {
    prompt: concatenatedInput,
    max_tokens: 600,
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
        const responseText = choices[0].text.trim();
        const startIndex = responseText.indexOf('Dear');
        return responseText.substring(startIndex);
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