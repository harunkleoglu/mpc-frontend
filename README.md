# Frontend - Product Card UI

## Tech Stack
- **Next.js 14 (React + TypeScript)**
- **Tailwind CSS**
- **zustand** for state management

## Layout Approach
Products are displayed in a responsive CSS grid layout (1 column: mobile, 2 columns: tablet, 3+ columns: desktop).

Each card includes an image, product name, description, price, category of the product, quantity, stock status and a button that toggles between “Add to Cart” and “Out of Stock” depending on availability.

There is a filter dropdown at top left of the screen which fully functional.

## How to Run
1. Clone the repository and install dependencies:
   ```bash
   npm install

2. Create .env file and add the API url.
    ```bash
    NEXT_PUBLIC_API_URL="https://mpc-backend-xm2t.onrender.com"
    ```
3. Run the project on development mode.
    ```bash
    npm run dev
    ```

4. For production build:
    ```bash
    npm run build && npm start

