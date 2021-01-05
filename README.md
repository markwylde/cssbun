# cssbun
An extremly lightweight bundler that does nothing but merge your css files using the import syntax.

The end result is you can use your css files directly in the browser without being bundled, or
you can use the bundle. They should both be interchangable.

## Installation
```bash
npm install --save-dev cssbun
```

(or) globally:
```bash
npm install -g cssbun
```

## Example
The best example is the [multiple test scenario](test/scenarios/multiple) used in this project.

## Usage
### CLI
```bash
cssbun -o bundled.css css/index.css
```

Optional arguments are:

```text
--watch (-w) [pattern]         rerun when the files change (default pattern is '**/*.css')
--output (-o) fileName         output the bundle to a file instead of to stdout
```

### Code
```javascript
const cssbun = require('cssbun');
const bundled = cssbun('./css/index.css');
console.log(bundled);
```

### CSS
To include another css file in your entrypoint (or any included file) use the `@import` feature:

```css
@import "./included.css";

.test {
  background-color: blue;
}
```

> Note: Any `@import url("???")` will not be parsed, and will stay in your bundle as intended.
