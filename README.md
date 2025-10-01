# Frontend - Product Card UI

## Tech Stack
- **Next.js 14 (React + TypeScript)**
- **Tailwind CSS**
- **zustand** for state management

## Layout Approach
Products are displayed in a responsive CSS grid layout (1 column: mobile, 2 columns: tablet, 3+ columns: desktop).

Each card includes an image, product name, description, price, category of the product, quantity, stock status and a button that toggles between “Add to Cart” and “Out of Stock” depending on availability.

There is a filter dropdown at top left of the screen which fully functional.

There is a indicator that shows item count in the cart.

## Responsiveness
Images have a fixed height with object-cover to maintain aspect ratio without distortion.

The grid uses grid-cols-1 sm:grid-cols-2 md:grid-cols-3 to adapt seamlessly across different screen sizes.

Buttons dynamically switch between active and disabled states based on stock status.

## How to Run
1. Clone the repository and install dependencies:
    ```bash
    npm install
    ```
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
    ```
