# cssbun
An extremly lightweight bundler than does nothing but bundles your css files using the import syntax.

## Installation
```bash
npm install --save-dev cssbun
```

## Usage
### CLI
```bash
cssbun -o bundled.css css/index.css
```

### Code
```javascript
const cssbun = require('cssbun');
const bundled = cssbun('./css/index.css');
console.log(bundled);
```

## CSS
To include another css file in your entrypoint (or any included file) use the `@import` feature:

```css
@import "./included.css";

.test {
  background-color: blue;
}
```
