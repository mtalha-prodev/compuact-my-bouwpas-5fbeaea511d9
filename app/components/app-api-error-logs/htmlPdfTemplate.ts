const htmlPdfTemplate = async (content: any) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pdf Content</title>
        <style>
            body {
                font-size: 16px;
                color: #000;
            }            h1 {
                text-align: center;
            }
            table {
              font-family: arial, sans-serif;
              border-collapse: collapse;
              width: 100%;
            }
            
            td, th {
              border: 2px solid #475949;
              text-align: left;
              padding: 10px;
            }
            
            
        </style>
    </head>
    <body>
        <div>
          <img 
            src="https://www.bouwpas.nl/wp-content/uploads/2020/12/logo-groen-zpayoff-1024x211.png" 
            alt="Bouwpas Logo"
            style="width: 200px; height:50px;object-fit: contain;"
          >
        </div>
        <div style="margin-bottom:50px;margin-top:50px;" >
          ${content}
        </div>
    </body>
    </html>
    `;
  return html;
};

export default htmlPdfTemplate;
