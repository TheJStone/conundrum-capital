import React from 'react';

const Instructions: React.FC = () => (
  <div className="bg-black p-6 rounded-lg shadow text-white mb-8 max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold mb-2">Welcome to Conundrum Capital</h1>
    <p className="mb-4">A solo spin on Acquire where you’re the only VC in the market and every move is a brain-teaser. Pick any puzzle below, then race the clock (and your own cash-flow) to hit the target net worth before the board locks up.</p>
    <ul className="list-disc pl-6 mb-2">
      <li><span className="font-semibold">Draw Your Opening Hand</span> – Each puzzle seeds the board with 10 starter tiles.</li>
      <li><span className="font-semibold">Place One Tile per Turn</span> – Drop a tile to found a new company, grow an existing one, or trigger a high-stakes merger (10x share price bonus). Single tiles that touch form the companies you’ll grow.</li>
      <li><span className="font-semibold">Buy Up to Three Shares</span> – After placement, spend cash on any active company. Price is determined by chain size and tier of company so make sure to invest early! </li>
      <li><span className="font-semibold">Repeat</span> – watch prices shift as your empire expands. Play continues until the turn limit hits or every company on the board has 11 or more tiles.</li>
    </ul>
    <div className="mb-2"><span className="font-bold">Scoring & Win Condition:</span> Each puzzle shows a “Par Valuation.” Grow companies, collect merger bonuses, and manage your stock & cash so that your net worth ≥ par when the puzzle ends. Company size drives the stock-price ladder and those all-important majority/minority payouts.</div>
  </div>
);

export default Instructions;
