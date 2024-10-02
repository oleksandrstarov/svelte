# Svelte

This document describes the recommended file structure for a Svelte application.

## Project Structure

```plaintext
svelte
├── public/
│ │ └── favicon.ico
├── src/
│ ├── assets/
│ ├── components/
│ ├── directives/
│ ├── utils/
│ ├── stores/
│ ├── styles/
│ ├── services/
│ ├── routes/
│ ├── App.svelte
│ └── main.js
├── package.json
├── vite.config.js
└── README.md
```

## Directory Breakdown

### `public/`

This folder contains static files.
Example:

- **`favicon.ico`**: The favicon for your application.

### `src/`

This is where the main application code resides.

- **`assets/`**: Contains static resources like images, fonts, and icons.

- **`components/`**: Stores reusable Svelte components.

  Example:

  ```plaintext
  components/
  ├── Button.svelte
  ├── Card.svelte
  └── Header.svelte
  ```

- **`directives/`**: Contains directives.

- **`utils/`**: Contains utility functions.

- **`stores/`**: Contains Svelte stores for managing global state.

Example:
`plaintext`

```plaintext
stores/
├── userStore.js
└── weatherStore.js
```

- **`services/`**: Contains services for work with API.

- **`styles/`**: Contains global styles and variables. It can also include specific styles for your components.

- **`routes/`**: Contains components that correspond to different routes in your application.

Example:

```plaintext
routes/
  ├── Home.svelte
  ├── About.svelte
  └── Contact.svelte
```
