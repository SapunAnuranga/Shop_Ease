import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        {t('aboutUs')}
      </h1>

      {/* Description */}
      <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
        <p>{t('aboutDescription1')}</p>
        <p>{t('aboutDescription2')}</p>
      </div>
    </section>
  );
};

export default About;
