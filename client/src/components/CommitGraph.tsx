import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type CommitData = {
  time: string;
  commits: number;
};

type Props = {
  commitData: CommitData[];
};

const CommitGraph: React.FC<Props> = ({ commitData }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: 200, 
      background: 'rgba(255,255,255,0.05)', 
      borderRadius: 16, 
      padding: '16px 24px',
      margin: '0 auto',
      maxWidth: 600
    }}>
      <ResponsiveContainer>
        <LineChart data={commitData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="#fff"
            tick={{ fill: '#fff', fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis 
            stroke="#fff"
            tick={{ fill: '#fff', fontSize: 12 }}
            tickMargin={8}
            width={30}
          />
          <Tooltip
            contentStyle={{
              background: '#201653',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 12
            }}
          />
          <Line
            type="monotone"
            dataKey="commits"
            stroke="#56D364"
            strokeWidth={2}
            dot={{ fill: '#56D364', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#56D364' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommitGraph;
 