---
name: full
---
<html lang="en">
    <head>
        <title>{{page.title}}</title>
        <meta name="description" content="{{page.description}}">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mdbootstrap@4.20.0/css/mdb.min.css" integrity="sha256-jpjYvU3G3N6nrrBwXJoVEYI/0zw8htfFnhT9ljN3JJw=" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/all.min.css" integrity="sha256-mUZM63G8m73Mcidfrv5E+Y61y7a12O5mW4ezU3bxqW4=" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/academicons@1.9.1/css/academicons.min.css" integrity="sha256-i1+4qU2G2860dGGIOJscdC30s9beBXjFfzjWLjBRsBg=" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:100,300,400,500,700|Material+Icons">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jwarby/jekyll-pygments-themes@master/github.css" media="none" id="highlight_theme_light">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jwarby/jekyll-pygments-themes@master/native.css" media="" id="highlight_theme_dark">
        <!-- <link rel="canonical" href="https://dvidsilva.com/"> -->
        <link rel="stylesheet" href="/main.css">
    </head>
    <body>
    <div class="post">
        <header class="post-header">
          <h1 class="post-title">
                {{page.name}}
          </h1>
          <p class="desc">{{ page.description }}</p>
        </header>
    </div>
    <article>
        <div class="clearfix">
            {{{content}}}
        </div>
    </article>
    </body>
</html>
