import chalk from 'chalk';
import express from 'express';
import readMtsFile from './readMtsFile';

const { blue, gray, white } = chalk;

(() => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.get('/', async (req, res) => {
    const mechs = await readMtsFile();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>megamek-to-alpha-strike</title>
  <link rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/default.min.css">
</head>
<body>
  <pre>
    <code class="JSON">
${JSON.stringify(mechs, null, 2)}
    </code>
  </pre>
  
  <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js"></script>
  <script>
    hljs.initHighlightingOnLoad();
  </script>
</body>
</html>
`;

    res.status(200).send(html);
  });

  app.listen(port, () =>
    console.log(
      `
${blue(`Now listening at...`)}
${white(`http://localhost:${port}`)}   ${blue(`<--Open in your browser`)}
`,
    ),
  );
})();
