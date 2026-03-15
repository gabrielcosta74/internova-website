import React from 'react';
import { useDevice } from '../lib/DeviceContext';
import { HeroMobile } from './HeroMobile';
import { HeroDesktop } from './HeroDesktop';

export const Hero: React.FC = () => {
  const { isMobile } = useDevice();

  if (isMobile) {
    return <HeroMobile />;
  }

  return <HeroDesktop />;
};
