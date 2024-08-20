const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({ apiKey });

// Function to handle OpenAI Chat completions
async function chat(message, prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: message }
      ],
      max_tokens: 1500
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return 'An error occurred. Please try again later.';
  }
}

// Function to summarize text for DALL-E prompt
async function summarizeText(text) {
  try {
    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Summarize the following text focusing on the key points relevant for generating an annotated image. I want to use it to create a detailed diagram. The image will clearly show the key areas mentioned in the medical report and use arrows or labels to point out these specific sections. Ensure the image is colorful and visually engaging to help with understanding. Include annotations that are clear and easy to interpret. The image will include annotations that make it easy for a non-medical person to understand the highlighted areas and their significance based on the medical report. Keep the summary under 1000 characters'
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 200
    });
    return summaryResponse.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing text:', error);
    return '';
  }
}

// Function to generate an image and annotate it using DALL-E
async function generateImageAndAnnotate(textDescription) {
  try {
    // Summarize the description if it's too long
    const summarizedDescription = await summarizeText(textDescription);

    // Generate image using DALL-E with the summarized description
    const imageResponse = await openai.images.generate({
      prompt: summarizedDescription,
      n: 1,
      size: '512x512' // Adjust size as needed
    });

    // Get the image URL from the response
    const imageUrl = imageResponse.data[0].url;
    return imageUrl;

  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

// Set up Multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the AI medical report analysis server! 🙏');
});

app.post('/chat', upload.single('file'), async (req, res) => {
  const prompt = `
    Please summarize the "impression" section of a medical report, such as an MRI, in a way that is simple, memorable, and emotionally engaging for an adult with no medical background. Assume the person has only completed high school education and is unfamiliar with medical terminology. The goal is for them to understand the summary clearly while feeling reassured or empowered about their health.

    Your summary should:
    
    Be Emotionally Supportive: Use kind, empathetic language to provide comfort and hope.
    Use Relatable Analogies: Compare medical issues to everyday situations to make them easier to understand.
    Highlight Positive Actions or Next Steps: Offer a sense of control or optimism where appropriate.
    Be Easy to Remember: Use concise language or storytelling techniques to make the summary memorable.
    For example, if the report discusses a disc herniation in the spine, you could liken it to a cushion that’s been compressed but assure the patient that it’s a common condition with effective treatments available.
  `;

  const { message } = req.body;
  const file = req.file;

  if (!message) {
    return res.status(400).send('Missing message in request body');
  }

  if (!file) {
    return res.status(400).send('Missing file in request');
  }

  try {
    // Parse the PDF file from memory
    const parsedPDF = await pdfParse(file.buffer);
    const pdfText = parsedPDF.text;

    // Combine the message with the PDF content
    const combinedMessage = `${message}\nFile Content:\n${pdfText}`;
    const response = await chat(combinedMessage, prompt);

    // Generate image using DALL-E based on the summarized PDF text
    const imagePrompt = `
      Create a detailed and annotated image based on the following description:
      ${pdfText}
      Highlight key areas such as specific sections of the spinal cord or other relevant body parts, with arrows pointing to important parts as described in the report.
    `;
    const annotatedImage = await generateImageAndAnnotate(imagePrompt);

    res.json({ response, image: annotatedImage });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});


app.listen(3000, () => console.log('Server listening on port 3000'));
