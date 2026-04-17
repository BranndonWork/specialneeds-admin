#!/usr/bin/env node

// Quick script to fetch an article and save the response
const fs = require('fs');
const http = require('http');

// You'll need to replace these values
const API_URL = 'http://localhost:8001';
const ARTICLE_ID = '1'; // Or any valid article ID
const TOKEN = process.env.API_TOKEN || ''; // Set via environment or update here

const options = {
  hostname: 'localhost',
  port: 8001,
  path: `/api/v1/articles/${ARTICLE_ID}/?level=editor`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      const outputPath = './docs/api-examples/article-editor-response.json';
      fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
      console.log(`Article response saved to ${outputPath}`);
      console.log('\nResponse preview:');
      console.log(JSON.stringify(jsonData, null, 2).substring(0, 500) + '...');
    } catch (e) {
      console.error('Error parsing response:', e);
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error fetching article:', error);
});

req.end();

console.log(`Fetching article ${ARTICLE_ID} from ${API_URL}...`);
