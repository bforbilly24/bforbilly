# Bforbilly

[![CodeTime Badge](https://img.shields.io/endpoint?style=social&color=222&url=https%3A%2F%2Fapi.codetime.dev%2Fv3%2Fusers%2Fshield%3Fuid%3D33249)](https://codetime.dev)

A modern developer portfolio built with Next.js, featuring real-time coding activity tracking powered by [CodeTime](https://codetime.dev).

## Features

- **Real-time Coding Activity**: Track coding sessions, languages, and productivity metrics
- **CodeTime Integration**: Display coding statistics, total hours, and language breakdown
- **Interactive Dashboard**: Visual representation of coding patterns and preferences
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Mode**: Theme switching with system preference detection

## CodeTime Integration

This portfolio integrates with CodeTime to provide real-time insights into coding activity:

- **Total Coding Time**: Displays cumulative coding hours across all projects
- **Language Statistics**: Shows the most used programming languages with time breakdown
- **Project/Workspace Tracking**: Monitors time spent on different projects
- **Platform Analytics**: Tracks coding activity across different operating systems
- **Live Badge**: Real-time CodeTime badge showing current coding activity

The integration uses CodeTime's v3 API with authenticated endpoints to ensure accurate and personalized data display.

## Preview
![image](https://github.com/bforbilly24/bforbilly/assets/93701344/9801da25-c0bc-4f21-9c92-1525e6879be2)
![image](https://github.com/bforbilly24/bforbilly/assets/93701344/38866465-42b1-45f1-b800-29a51990fc4f)
![image](https://github.com/bforbilly24/bforbilly/assets/93701344/cc2bf914-a189-4354-b9ca-f16b79839ffc)
![image](https://github.com/bforbilly24/bforbilly/assets/93701344/dfdb8872-d779-4275-911b-3d271ddb2d16)
![image](https://github.com/bforbilly24/bforbilly/assets/93701344/937f5f3f-7c90-41ec-9cce-faa3d6a85be3)
![image](https://github.com/bforbilly24/bforbilly/assets/93701344/ada33876-aeb1-43f1-aed5-6b40e2fee538)
![image](https://github.com/bforbilly24/bforbilly/assets/93701344/d50c2ed8-c00d-4dbe-acd5-0c94e913a275)
![image](https://github.com/bforbilly24/bforbilly/assets/93701344/9e14d5b8-3f35-4e04-9a5c-0e240c4609ae)

## Stack
- [NextJS 14](https://nextjs.org) - Next.js is a React framework for building full-stack web applications, in this site i use App Router.
- [TailwindCSS](https://tailwindcss.com) - A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.
- [Shadcn UI](https://ui.shadcn.com/) - Beautifully designed components built with Radix UI and Tailwind CSS.

## Running Locally

1. Clone the repository
```bash
git clone https://github.com/bforbilly24/bforbilly.git
cd bforbilly
```

2. Install dependencies
```bash
bun install
# or
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Add your CodeTime API token to `.env`:
```env
CODETIME_API_TOKEN=your_codetime_api_token_here
CODETIME_API_BASE_URL="https://api.codetime.dev/v3"
```

To get your CodeTime API token:
1. Visit [CodeTime](https://codetime.dev)
2. Sign up/Sign in with your GitHub account
3. Go to your dashboard and generate an API token

4. Start the development server
```bash
bun dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`.
