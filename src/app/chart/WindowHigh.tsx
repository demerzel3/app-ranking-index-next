import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export function WindowHigh({ children }: Props) {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setWindowHeight(window.innerHeight);
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return <div style={{ height: windowHeight }}>{children}</div>;
}
