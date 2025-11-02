interface TrendsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

interface TrendsChartProps {
  data: TrendsData;
}

export function TrendsChart({ data }: TrendsChartProps) {
  const maxValue = Math.max(...data.datasets.flatMap(d => d.data));

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Weekly Trends</h3>
      
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white/50 pr-4">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-t border-white/10"></div>
            ))}
          </div>
          
          {/* Chart bars */}
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {data.labels.map((label, index) => (
              <div key={label} className="flex flex-col items-center space-y-2 flex-1">
                <div className="flex space-x-1 items-end h-48">
                  {data.datasets.map((dataset, datasetIndex) => (
                    <div
                      key={dataset.label}
                      className="w-4 rounded-t transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${(dataset.data[index] / maxValue) * 100}%`,
                        backgroundColor: dataset.borderColor,
                      }}
                      title={`${dataset.label}: ${dataset.data[index]}`}
                    ></div>
                  ))}
                </div>
                <span className="text-xs text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        {data.datasets.map((dataset) => (
          <div key={dataset.label} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: dataset.borderColor }}
            ></div>
            <span className="text-sm text-white/70">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
