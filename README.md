## Mango Music

This is a music webapp. Build width [Create React App](https://github.com/facebookincubator/create-react-app).

## Project Structure

This project should look like this:

```
mango-music/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  scripts/
    customized-build.js
    overrides-config.base.js
    overrides-config.dev.js
    overrides-config.prod.js
  src/
    api/
      config.js
      jsonp.js
      ranking.js
      recommend.js
      search.js
      singer.js
      song.js
    assets/
      imgs/
        ...
      stylus/
        fonts/
        font.styl
        reset.styl
    common/
      header/
        ...
      loading/
        ...
      scroll/
        ...
    components/
      album/
        ...
      play/
        ...
      ranking/
        ...
      recommend/
        ...
      searc/
        ...
      singer/
        ...
    containers/
      ...
    model/
      ...
    redux/
      ...
    api.test.js
    index.css
    index.js
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
