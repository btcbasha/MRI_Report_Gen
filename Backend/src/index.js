const express = require('express');
const multer = require('multer');
const fs = require('fs');
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

async function createConciseSummary(pdfText) {
  const summaryPrompt = `
    Summarize the following medical report in 1-2 sentences, focusing on the most critical points that need to be visually explained. 
    
    Medical Report Summary:
    ${pdfText}
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: summaryPrompt }],
      max_tokens: 100
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error creating concise summary:', error);
    return 'No summary available.';
  }
}

async function generateImageAndAnnotate(textDescription) {
  try {
    // Generate image using DALL-E with a focused description
    const imageResponse = await openai.images.generate({
      prompt: textDescription,
      n: 1,
      size: '512x512' // Adjust size as needed to fit translation box
    });

    // Get the image URL from the response
    const imageUrl = imageResponse.data[0].url;
    return imageUrl;

  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

async function analyzeReportForImage(pdfText) {
  const analysisPrompt = `
    Analyze the following medical report and provide a concise summary focusing on the most important details that could be visualized. 
    Include key medical terms and specific symptoms or conditions that are most relevant for creating a visual aid. 
    
    Medical Report:
    ${pdfText}
  `;

  const analysisResult = await chat(analysisPrompt, '');
  return analysisResult.trim();
}

const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the AI medical report analysis server! 🙏');
});

app.post('/chat', upload.single('file'), async (req, res) => {
  const prompt = `
    You are an expert physician with over 1000 years of experience across all medical fields. I am uploading a medical report in PDF format. 
    Please read and analyze it carefully. Identify and summarize all important points, providing a clear and accurate overview as if you are explaining to an adult person who has not graduated high school. 
    Your analysis should include any potential issues, noting whether the findings are normal, concerning, or require further investigation.
    
    In addition, use pictures to help explain terms when necessary, such as spinal sections or brain regions, to the patient so they can visualize the location of the problem. Discuss symptoms beyond just pain, like how different conditions might affect various parts of the body. 
    Provide opportunities to dive deeper into subjects if the patient wishes to learn more. Ensure that your explanation is memorable and emotionally engaging.`;

  const { message } = req.body;
  const file = req.file;

  if (!message) {
    return res.status(400).send('Missing message in request body');
  }

  if (!file) {
    return res.status(400).send('Missing file in request');
  }

  try {
    const fileContent = fs.readFileSync(file.path);
    const parsedPDF = await pdfParse(fileContent);
    const pdfText = parsedPDF.text;

    const combinedMessage = `${message}\nFile Content:\n${pdfText}`;
    const response = await chat(combinedMessage, prompt);

    // Create a concise summary of the MRI report
    const conciseSummary = await createConciseSummary(pdfText);

    let annotatedImage = null;
    if (conciseSummary !== 'No summary available.') {
      annotatedImage = await generateImageAndAnnotate(conciseSummary);
    }

    res.json({ response, image: annotatedImage });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  } finally {
    fs.unlinkSync(file.path);
  }
});

// New endpoint to fetch additional information
app.get('/api/additional-info', async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic query parameter' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Provide detailed information about ${topic} suitable for a patient with no medical background. Include key points, implications, and what the patient should understand about this condition.`
        }
      ],
      max_tokens: 500
    });

    const info = response.choices[0].message.content;
    res.json({ info });

  } catch (error) {
    console.error('Error fetching additional information:', error);
    res.status(500).json({ error: 'Error fetching additional information' });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
