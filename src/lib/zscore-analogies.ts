// Human-scale analogies for z-scores
// Makes statistical rarity relatable to non-statisticians

export interface ZScoreAnalogy {
  probability: string;
  analogy: string;
  color: string;
  severity: 'high' | 'extreme' | 'astronomical';
}

export function getZScoreAnalogy(z: number): ZScoreAnalogy {
  const absZ = Math.abs(z);
  
  if (absZ >= 6) {
    return {
      probability: '1 in 500 million',
      analogy: 'Rarer than being struck by lightning twice in one year',
      color: 'bg-purple-900 text-white',
      severity: 'astronomical'
    };
  }
  
  if (absZ >= 5) {
    return {
      probability: '1 in 3.5 million',
      analogy: 'Like winning a state lottery jackpot',
      color: 'bg-red-900 text-white',
      severity: 'astronomical'
    };
  }
  
  if (absZ >= 4.5) {
    return {
      probability: '1 in 300,000',
      analogy: 'Odds of being struck by lightning in your lifetime',
      color: 'bg-red-700 text-white',
      severity: 'extreme'
    };
  }
  
  if (absZ >= 4) {
    return {
      probability: '1 in 31,574',
      analogy: 'Finding a four-leaf clover on your first try',
      color: 'bg-red-600 text-white',
      severity: 'extreme'
    };
  }
  
  if (absZ >= 3.5) {
    return {
      probability: '1 in 4,300',
      analogy: 'Being dealt a flush in poker on the first hand',
      color: 'bg-orange-600 text-white',
      severity: 'extreme'
    };
  }
  
  if (absZ >= 3) {
    return {
      probability: '1 in 741',
      analogy: 'Rolling the same number on a die five times in a row',
      color: 'bg-orange-500 text-black',
      severity: 'high'
    };
  }
  
  return {
    probability: '1 in 44',
    analogy: 'Above 2 standard deviations',
    color: 'bg-yellow-400 text-black',
    severity: 'high'
  };
}

export function formatZScore(z: number): string {
  const formatted = z.toFixed(1);
  return z >= 0 ? `+${formatted}σ` : `${formatted}σ`;
}
