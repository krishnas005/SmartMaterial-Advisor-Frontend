export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      const { materialName } = req.body;
  
      const systemPrompt = `You are a materials science expert. Generate a comprehensive overview of the material provided. 
      The response should be formatted as a JSON object with the following sections:
      1. About: Brief introduction and main uses
      2. Origin: Production process and locations
      3. Sustainability: Environmental impact and benefits
      4. Regulations: Compliance and standards in India
      5. Producers: Major manufacturers
      6. CorporateUse: How companies use it sustainably
      7. Research: Recent developments and innovations
  
      Format the response as:
      {
        "title": "Material name",
        "sections": {
          "about": "text",
          "origin": "text",
          "sustainability": "text",
          "regulations": "text",
          "producers": "text",
          "corporateUse": "text",
          "research": "text"
        }
      }`;
  
      const userPrompt = `Generate an overview for ${materialName}`;

      const URL = process.env.OPENAI_API_URL;
      const API_KEY = process.env.OPENAI_API_KEY;
  
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
  
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
  
      const data = await response.json();
      const overview = JSON.parse(data.choices[0].message.content);
      
      res.status(200).json(overview);
    } catch (error) {
      console.error('Error generating overview:', error);
      res.status(500).json({ message: 'Error generating overview', error: error.message });
    }
  }