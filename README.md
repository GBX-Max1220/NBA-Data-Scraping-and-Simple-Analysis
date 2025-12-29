# NBA Data Intelligent Query Tool

An AI-powered NBA data analysis tool that enables efficient data querying and visualization through natural language interaction, providing an intuitive and powerful data analysis experience for basketball enthusiasts and analysts.


## Core Features in Detail

### 1. Intelligent Natural Language Parsing – Query with Zero Learning Cost
Supports direct queries in everyday language without the need to memorize complex query syntax. The AI automatically understands your needs:
- Example queries:
  - "Compare the average points, assists, and rebounds of 2024-25 regular season MVP candidates"
  - "Three-point shooting percentage changes of the Lakers in their last 10 games"
  - "Who are the top 3 players aged 30+ with the highest average steals this season?"
- Parsing capabilities: Automatically identifies query targets (players/teams), metrics (points/rebounds, etc.), time ranges (season/last N games), and filtering conditions (rank/age, etc.).

### 2. Multi-turn Conversation Context Association – Smoother Continuous Queries
Supports context-aware continuous interaction, eliminating the need to repeat background information:
- Example scenario:
  - First round: "How are Curry's three-point stats this season?"
  - Second round: "Who has a higher shooting percentage between him and Harden?" (AI automatically associates "this season" and "three-point" context)
- Conversation history retains up to 5 rounds to ensure context coherence while avoiding information overload.

### 3. Dynamic Visualization Charts – More Intuitive Data Presentation
Intelligently matches charts based on query types, with rich interaction features:
- Ranking data (e.g., "Top 10 scorers in the league") → Horizontal bar charts, clearly showing rankings and values
- Time trend data (e.g., "Score changes in the last 20 games") → Line charts, with key nodes marked (e.g., during winning streaks)
- Multi-metric comparison data (e.g., "5 core stats of Eastern/Western Conference championship candidates") → Grouped bar charts, supporting horizontal/vertical switching
- Interaction features:
  - Hover to display detailed data (e.g., "Stephen Curry: 3.2 three-pointers per game, 42.1% shooting")
  - Click legend items to hide/show specific data groups, focusing on key comparisons
  - Responsive design: Automatically adjusts layout on mobile devices, with vertical stacking of charts

### 4. Local Data Persistence – Conversation History Never Lost
- Conversation history is automatically saved to local storage (localStorage) with a 7-day validity period
- Historical conversations remain accessible after page refreshes or browser restarts
- Supports one-click clearing of history to protect privacy


## Tech Stack

| Category       | Technology/Tool                  | Description                          |
|----------------|----------------------------------|--------------------------------------|
| Core Framework | React 18 + TypeScript            | Type-safe component-based development |
| Build Tool     | Vite                             | Fast hot reloading, optimized development experience |
| AI Capability  | Gemini API (@google/generative-ai)| Natural language parsing and intent recognition |
| Visualization  | Recharts                         | Responsive data chart display        |
| State Management | Zustand                        | Lightweight state management, simplifying component communication |
| Local Storage  | localStorage                     | Conversation history persistence     |


## Quick Start

### Environment Requirements
- Node.js 16.x or higher
- npm 8.x or higher


### Installation Steps
1. Clone the repository
   ```bash
   git clone https://github.com/your-username/nba-data-query-tool.git
   cd nba-data-query-tool
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   - Copy `.env.example` to `.env.local`
   - Fill in your Gemini API key in `.env.local`:
     ```env
     VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
     ```
   > Tip: API keys can be obtained from [Google AI Studio](https://ai.studio.google/)

4. Start the development server
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` in your browser to use the tool


## Contact & Support

For technical communication, feature suggestions, or collaboration inquiries, feel free to contact via:
- WeChat: MaxGBX
- Email: gbx1220max@gmail.com
- LinkedIn: [Baixin Guo](https://www.linkedin.com/in/baixin-guo-681113285/)


## Project Structure

```
src/
├── components/          # UI components
│   ├── ChatPanel.tsx    # Conversation panel (includes message list and input area)
│   ├── InputArea.tsx    # Query input component
│   └── charts/          # Visualization chart components
│       ├── RankingBarChart.tsx   # Ranking bar chart
│       ├── TimeSeriesLineChart.tsx # Time series line chart
│       └── MultiMetricBarChart.tsx # Multi-metric bar chart
├── services/            # Service layer
│   └── gemini.ts        # Gemini API call encapsulation
├── store/               # State management
│   └── chatStore.ts     # Conversation state (messages, loading status, errors)
├── types/               # Type definitions
│   └── index.ts         # Core interfaces (conversation messages, parsing results, etc.)
├── App.tsx              # Application entry component
└── main.tsx             # Project entry file
```


## License

This project is open-source under the [MIT License](LICENSE), allowing free use, modification, and distribution.


## Notes

- Please keep your Gemini API key secure. `.env.local` is included in `.gitignore` to prevent accidental submission to code repositories
- Extensive queries may incur API fees; refer to Google AI Studio's pricing rules for details
- Data update frequency depends on NBA official data source synchronization cycles; slight delays in real-time performance may occur
