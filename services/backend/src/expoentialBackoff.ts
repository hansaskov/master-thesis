type BackoffConfig = {
  maxRetries: number;
  initialDelay: number;
  backoffFactor: number;
  maxDelay: number;
};

const DEFAULT_CONFIG: BackoffConfig = {
  maxRetries: 10,
  initialDelay: 1000,
  backoffFactor: 2,
  maxDelay: 30_000,
};

export const exponentialBackoff = async <T>(
  callback: () => Promise<T>,
  config: Partial<BackoffConfig> = {}
): Promise<boolean> => {
  const fullConfig: BackoffConfig = { ...DEFAULT_CONFIG, ...config };
  const { maxRetries, initialDelay, backoffFactor, maxDelay } = fullConfig;

  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await callback();
      return true;
    } catch (error) {
      console.error(`Attempt ${attempt + 1}/${maxRetries}  failed:`, error);
    }

    if (attempt === maxRetries) break;

    console.log(`Retrying in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    delay = Math.min(delay * backoffFactor, maxDelay);
  }

  return false;
};