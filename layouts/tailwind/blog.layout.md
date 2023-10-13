---
name: blog
---
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{page.title}} | Daveed's Blog</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="/main.css">
  <style>
    {{page.inline_styles}}
  </style>
</head>
<body>
  <div class="container mx-auto px-4">
    <div>
      <h1>{{page.title}}</h1>
      <main>
        {{{content}}}
      </main>
    </div>
  </div>
</body>
</html>
